const errorSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  required: [
    'message',
    'originalError'
  ],
  properties: {
    message: {
      description: 'Descriptive error message',
      type: 'string',
    },
    originalError: {
      description: 'Original Error object',
      type: 'object',
      additionalProperties: true
    }
  },
  additionalProperties: false
};

const notFoundSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  required: ['message'],
  properties: {
    message: {
      description: 'Descriptive error message',
      type: 'string',
    }
  },
  additionalProperties: false,
};

const productDefinition = {
  description: 'Product',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Product identifier in form of UUID',
    },
    title: {
      type: 'string',
      description: 'Product title',
    },
    description: {
      type: 'string',
      description: 'Product description',
    },
    price: {
      type: 'number',
      description: 'Product price',
    },
    count: {
      type: 'number',
      description: 'Product count',
    },
  },
  additionalProperties: false
};

const productSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  ...productDefinition
};

const productListSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'array',
  items: {
    $ref: '#/definitions/product'
  },
  uniqueItems: true,
  additionalProperties: false,
  definitions: {
    product: productDefinition
  }
};

export default {
  version: '1',
  title: 'Products Service API',
  models: [
    {
      name: 'ErrorResponse',
      description: 'This is an error',
      contentType: 'application/json',
      schema: errorSchema
    },
    {
      name: 'NotFoundResponse',
      description: 'Response in case when no product was found',
      contentType: 'application/json',
      schema: notFoundSchema
    },
    {
      name: 'ProductResponse',
      description: 'Product',
      contentType: 'application/json',
      schema: productSchema
    },
    {
      name: 'ProductListResponse',
      description: 'List of Products',
      contentType: 'application/json',
      schema: productListSchema
    }
  ]
};
