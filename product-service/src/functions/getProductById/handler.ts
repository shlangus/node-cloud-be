import 'source-map-support/register';

import type { APIGatewayProxyResult, } from 'aws-lambda';
import { formatJSONError, formatJSONResult, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { productService } from '@services/productService';
import type { GetProductByIdEvent } from './event';

export const getProductById = async ({ pathParameters }: GetProductByIdEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('getProductById is called. Parameters:', pathParameters);
    const product = await productService.getById(pathParameters.id);
    if (!product) {
      return formatJSONResponse(404, { message: 'Not Found' });
    }

    return formatJSONResult(product);
  } catch (e) {
    return formatJSONError({
      message: `Something went wrong during getting product with id ${pathParameters?.id}`,
      originalError: e
    });
  }
};

export const main = middyfy(getProductById);
