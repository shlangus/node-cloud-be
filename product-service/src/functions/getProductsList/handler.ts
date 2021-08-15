import 'source-map-support/register';

import type { APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONError, formatJSONResult } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { productService } from '@services/productService';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log('getProductsList is called.');
    const products = await productService.getAll();
    return formatJSONResult(products);
  } catch (e) {
    return formatJSONError({
      message: 'Something went wrong during getting product list',
      originalError: e
    });
  }
}

export const main = middyfy(getProductsList);
