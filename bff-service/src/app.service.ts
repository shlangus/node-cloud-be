import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getServiceUrl(name: string): string | undefined {
    return process.env[name?.toLowerCase()];
  }

}
