export const formatJSONResponse = (statusCode: number, response: Record<string, any> | Array<unknown> | string) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

export const formatJSONResult = (response: Record<string, any> | Array<unknown> | string) => formatJSONResponse(200, response);

export const formatJSONError = (response: Record<string, any>) => formatJSONResponse(500, response);
