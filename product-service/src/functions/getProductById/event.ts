import type { ParsedAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';

export type GetProductByIdEvent = ParsedAPIGatewayProxyEvent<typeof schema>
