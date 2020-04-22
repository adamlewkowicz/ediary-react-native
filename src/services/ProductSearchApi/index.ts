import { IlewazyApi } from '../IlewazyApi';
import { FoodFactsApi } from '../FoodFactsApi';
import { NormalizedProduct } from '../../types';

export class ProductSearchApi {
  
  private ilewazyApi = new IlewazyApi();
  private foodFactsApi = new FoodFactsApi();

  async findByName(
    name: string,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const foodFactsProducts = await this.foodFactsApi.findByName(name, 1, controller);

    if (foodFactsProducts.length) {
      return foodFactsProducts;
    }
    
    return this.ilewazyApi.findByName(name, controller);
  }

  findOneByBarcode = this.foodFactsApi.findByBarcode.bind(this.foodFactsApi);
  
}