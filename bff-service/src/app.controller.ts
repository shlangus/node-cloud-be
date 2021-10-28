import {
  All,
  BadGatewayException,
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  Query,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from 'axios';
import { Request } from 'express';
import { throwError } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly http: HttpService) {
  }

  @Get('/products')
  @UseInterceptors(CacheInterceptor)
  getProductList() {
    return this.http.get(this.appService.getServiceUrl('products'))
      .pipe(pluck('data'));
  }

  @All('/:serviceName/:path(*)?')
  route(@Req() request: Request,
        @Param('serviceName') serviceName: string,
        @Param('path') path: string,
        @Body() body: object,
        @Query() query: string) {
    const { method } = request;

    const serviceUrl = this.appService.getServiceUrl(serviceName);
    if (!serviceUrl) {
      console.error(`Cannot find an url for service ${serviceName}. Original url: ${request.originalUrl}`);
      throw new BadGatewayException('Cannot process request');
    }

    return this.http.request({
      baseURL: serviceUrl,
      url: path,
      method: method as Method,
      ...(method !== 'GET' && { data: body }),
      params: query
    }).pipe(
      pluck('data'),
      catchError(error => {
        if (error.response) {
          const { data, status } = error.response;
          return throwError(new HttpException({ message: data?.message }, status));
        }

        return throwError(error);
      })
    );
  }
}
