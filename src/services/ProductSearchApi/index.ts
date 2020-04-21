import { FriscoApi } from '../FriscoApi';
import { IlewazyApi } from '../IlewazyApi';
import { FoodFactsApi } from '../FoodFactsApi';
import { BarcodeId, NormalizedProduct } from '../../types';

export class ProductSearchApi {
  
  private friscoApi = new FriscoApi();
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

  async findByBarcode(
    barcode: BarcodeId,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const foodFactsProduct = await this.foodFactsApi.findByBarcode(
      barcode,
      controller,
    );

    if (foodFactsProduct === null) {
      return this.friscoApi.findByBarcode(barcode, controller);
    }
    
    return [foodFactsProduct];
  }
  
}