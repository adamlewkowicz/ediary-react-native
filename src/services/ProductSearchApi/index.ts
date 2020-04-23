import { IlewazyApi } from '../IlewazyApi';
import { FoodFactsApi } from '../FoodFactsApi';
import { NormalizedProduct } from '../../types';

export class ProductSearchApi {
  
  private ilewazyApi = new IlewazyApi();
  private foodFactsApi = new FoodFactsApi();

  async findByName(
    name: string,
    controller: AbortController
  ): Promise<NormalizedProduct[]> {
    const ilewazyProducts = await this.ilewazyApi.findByName(name, controller);

    if (!ilewazyProducts.length) {
      return this.foodFactsApi.findByName(name, controller);
    }

    return ilewazyProducts;
  }

  findOneByBarcode = this.foodFactsApi.findOneByBarcode.bind(this.foodFactsApi);
  
}