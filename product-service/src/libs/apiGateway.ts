import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export type ParsedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }

export const formatJSONResponse = (statusCode: number, response: Record<string, any> | Array<unknown>) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

export const formatJSONResult = (response: Record<string, any> | Array<unknown>) => formatJSONResponse(200, response);

export const formatJSONError = (response: Record<string, any>) => formatJSONResponse(500, response);
