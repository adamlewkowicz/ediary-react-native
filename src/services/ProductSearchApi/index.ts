import { FriscoApi } from '../FriscoApi';
import { IlewazyApi } from '../IlewazyApi';
import { FoodFactsApi } from '../FoodFactsApi';
import { BarcodeId, NormalizedProduct } from '../../types';

export class ProductSearchApi {
  
  private friscoApi = new FriscoApi();
  private ilewazyApi = new IlewazyApi();
  private foodFactsApi = new FoodFactsApi();

  findByName = this.ilewazyApi.findByName.bind(this.ilewazyApi);

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