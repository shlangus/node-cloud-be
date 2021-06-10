import { products } from './productsMock';

class ProductService {

  constructor(private products) {}

  async getAll() {
    return this.products;
  }

  async getById(id: string) {
    return this.products.find(product => product.id === id);
  }

}

export const productService = new ProductService(products);

