import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// const map = {
//   cart: 'http://shlangus-cart-api-dev.eu-west-1.elasticbeanstalk.com/api/profile/cart',
//   products: 'https://ebygl9njp0.execute-api.eu-west-1.amazonaws.com/dev/products',
// };

@Injectable()
export class AppService {

  constructor(private config: ConfigService) {}

  getServiceUrl(name: string): string | undefined {
    return this.config.get(name);
  }

}
