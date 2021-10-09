import 'source-map-support/register';

import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { AuthService } from '../../services/authService';

const authService = new AuthService();

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('basicAuthorizer is called. Event:', event);

  const { authorizationToken, methodArn } = event;

  if (!authorizationToken) {
    throw new Error("Unauthorized")
  }

  let result;
  try {
    result = authService.verifyCredentials(authorizationToken, methodArn);
  } catch (error) {
    console.log('Something went wrong.', error);
    throw new Error("Unauthorized");
  }

  return result;
};

export const main = basicAuthorizer;
