import 'source-map-support/register';

import { CreateProductEvent } from './event';
import { APIGatewayProxyResult } from 'aws-lambda';
import { productService } from '@services/productService';
import { formatJSONError, formatJSONResult } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

export const createProduct = async ({ body }: CreateProductEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('createProduct is called. Parameters:', body);
    const result = await productService.create(body);

    return formatJSONResult(result);
  } catch (e) {
    return formatJSONError({
      message: `Something went wrong during creating a product: ${body}`,
      originalError: e
    });
  }
};

export const main = middyfy(createProduct);
