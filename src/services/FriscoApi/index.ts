import { BarcodeId, NormalizedProduct } from '../../types';
import { FriscoQueryApi } from './FriscoQueryApi';
import { FriscoProductIdApi } from './FriscoProductIdApi';

export class FriscoApi {

  private friscoQueryApi = new FriscoQueryApi();
  private friscoProductIdApi = new FriscoProductIdApi();

  async findByBarcode(
    barcode: BarcodeId,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const { normalized, unnormalized: raw } = await this.friscoQueryApi.find(barcode as string, controller);
    const normalizationFailed = !normalized.length && raw.length;

    if (normalizationFailed) {
      const [firstRawProduct] = raw;

      const foundProduct = await this.friscoProductIdApi.findOne(
        firstRawProduct.productId,
        controller,
      );

      return foundProduct ? [foundProduct] : [];
    }

    return normalized;
  }

}