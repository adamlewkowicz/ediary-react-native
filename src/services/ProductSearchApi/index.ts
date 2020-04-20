import { FriscoApi } from '../FriscoApi';
import { IlewazyApi } from '../IlewazyApi';
import { OpenFoodFactsApi } from '../OpenFoodFactsApi';
import { BarcodeId, NormalizedProduct } from '../../types';

export class ProductSearchApi {
  
  private friscoApi = new FriscoApi();
  private ilewazyApi = new IlewazyApi();
  private openFoodFactsApi = new OpenFoodFactsApi();

  findByName = this.ilewazyApi.findByName.bind(this.ilewazyApi);

  async findByBarcode(
    barcode: BarcodeId,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const foodFactsProduct = await this.openFoodFactsApi.findByBarcode(
      barcode,
      controller,
    );

    if (foodFactsProduct === null) {
      return this.friscoApi.findByBarcode(barcode, controller);
    }
    
    return [foodFactsProduct];
  }
  
}