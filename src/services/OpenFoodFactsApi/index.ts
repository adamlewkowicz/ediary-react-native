import { BarcodeId, NormalizedProduct, MacroElements } from '../../types';
import * as Utils from '../../utils';
import * as ApiTypes from './types';
import { Product } from '../../database/entities';

export class OpenFoodFactsApi {
  
  URL: string

  NOT_FOUND_STATUS = 0;
  
  constructor(country = 'world') {
    this.URL = `https://${country}.openfoodfacts.org`;
  }

  async findByBarcode(barcode: BarcodeId): Promise<NormalizedProduct | null> {
    const response = await Utils.fetchify<ApiTypes.Response>(
      `${this.URL}/api/v0/product/${barcode}.json`
    );

    const normalizedProduct = this.normalizeProduct(response);

    return normalizedProduct;
  }

  private normalizeProduct(response: ApiTypes.Response): NormalizedProduct | null {
    const { status, product } = response;

    if (status === this.NOT_FOUND_STATUS || product == null) {
      return null;
    }

    if (product.product_name_pl == null) {
      return null;
    }

    const _id = product._id;
    const name = product.product_name_pl;
    const macro = this.normalizeMacro(product.nutriments);
    const portion = this.normalizePortion(product.serving_size);
    const portions = this.normalizePortions(portion);

    const normalizedProduct: NormalizedProduct = {
      _id,
      name,
      macro,
      portion,
      portions,
    }

    return normalizedProduct;
  }

  private normalizeMacro(nutriments: ApiTypes.Product['nutriments']): MacroElements {
    const carbs = nutriments['carbohydrates_100g'];
    const prots = nutriments['proteins_100g'];
    const fats = nutriments['fat_100g'];
    const kcal = nutriments['energy-kcal_100g'];

    const macro = {
      carbs,
      prots,
      fats,
      kcal,
    }

    return macro;
  }

  private normalizePortions(portion: number): NormalizedProduct['portions'] {
    if (portion !== Product.defaultPortion) {
      return [
        {
          type: 'portion',
          value: portion,
          unit: GRAM_UNIT,
        }
      ]
    }
    return [];
  }
  
  private normalizePortion(servingSize: string): number {
    if (servingSize.includes(GRAM_UNIT)) {
      const portionWithoutUnit = servingSize.replace(GRAM_UNIT, '');
      const normalizedPortion = Number(portionWithoutUnit);

      if (Utils.isANumber(normalizedPortion)) {
        return normalizedPortion; 
      }
    }
    return Product.defaultPortion;
  }
}

const GRAM_UNIT = 'g';