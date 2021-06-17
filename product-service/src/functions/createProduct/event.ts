import type { ParsedAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';

export type CreateProductEvent = ParsedAPIGatewayProxyEvent<typeof schema>
