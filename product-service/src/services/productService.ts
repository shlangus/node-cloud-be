import { QueryConfig, Pool } from 'pg';
import type { Product } from '@models/product';

// TODO: figure out what industry standard for dealing with queries is. Any query builders? ORMs?
//  let's pretend we don't know about stored procedures
const getAllQueryText = 'SELECT p.id, p.title, p.description, p.price, s.count FROM products p LEFT JOIN stocks s on p.id = s.product_id';
const getByIdQueryText = getAllQueryText + ' WHERE id = $1';

// https://node-postgres.com/features/pooling
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
});

class ProductService {

  constructor(private clientPool = pool) {
  }

  async getAll() {
    const result = await this.runQuery<Product>({
      text: getAllQueryText,
    });
    return result.rows;
  }

  async getById(id: string) {
    const result = await this.runQuery<Product>({
      text: getByIdQueryText,
      values: [id]
    });
    return result.rows[0];
  }

  async create(product: Omit<Product, 'id'>) {
    const result = await this.runQuery<Pick<Product, 'id'>>({
      text: 'WITH rows AS ' +
        '(INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id) INSERT ' +
        'INTO stocks (product_id, count) SELECT id, $4 FROM rows RETURNING product_id as id',
      values: [product.title, product.description, product.price, product.count]
    });
    return result.rows[0];
  }

  private async runQuery<R>(query: QueryConfig) {
    const client = await this.clientPool.connect();

    try {
      try {
        return await client.query<R>(query);
      } finally {
        client.release();
      }
    } catch (e) {
      console.log('DB query failed:', query);
      console.log('Error:', e);
      throw e;
    }
  }

}

export const productService = new ProductService();

