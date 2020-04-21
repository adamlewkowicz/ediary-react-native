import { BarcodeId, NormalizedProduct, MacroElements } from '../../types';
import * as Utils from '../../utils';
import * as ApiTypes from './types';
import { Product } from '../../database/entities';
import { name as appName } from '../../../app.json';
import { version as appVersion } from '../../../package.json';
import { Platform } from 'react-native';

export class OpenFoodFactsApi {
  
  URL: string

  NOT_FOUND_STATUS = 0;

  userAgent = `UserAgent: ${appName} - ${Platform.OS} - Version ${appVersion} -`;

  country: ApiTypes.Country;
  
  constructor(country: ApiTypes.Country = 'pl') {
    this.country = country;
    this.URL = `https://${this.country}.openfoodfacts.org`;
  }

  async findByBarcode(
    barcode: BarcodeId,
    controller?: AbortController
  ): Promise<NormalizedProduct | null> {

    const response = await Utils.fetchify<ApiTypes.ResponseEan>(
      `${this.URL}/api/v0/product/${barcode}.json`,
      { headers: { 'User-Agent': this.userAgent }},
      controller
    );

    if (
      response.status === this.NOT_FOUND_STATUS ||
      response.product == null
    ) {
      return null;
    }

    const normalizedProduct = this.normalizeProduct(response.product);

    return normalizedProduct;
  }

  async findByCategory(
    category: string,
    page = 1,
    controller?: AbortController
  ): Promise<unknown> {

    const response = await Utils.fetchify(
      `${this.URL}/category/${category}/${page}.json`,
      { headers: { 'User-Agent': this.userAgent }},
      controller
    );

    return response;
  }

  private normalizeProduct(product: ApiTypes.Product): NormalizedProduct | null {
    if (product.product_name_pl == null) {
      return null;
    }

    const _id = product._id;
    const name = product.product_name_pl;
    const macro = this.normalizeMacro(product.nutriments);
    const portion = this.normalizePortion(product.serving_size);
    const portions = this.normalizePortions(portion);
    const images = this.normalizeImages(product);

    const normalizedProduct: NormalizedProduct = {
      _id,
      name,
      macro,
      portion,
      portions,
      images,
    }

    return normalizedProduct;
  }

  private normalizeMacro(nutriments: ApiTypes.Product['nutriments']): MacroElements {
    const carbs = nutriments['carbohydrates_100g'];
    const sugars = nutriments['sugars_100g'];
    const prots = nutriments['proteins_100g'];
    const fats = nutriments['fat_100g'];
    const fattyAcids = nutriments['saturated-fat_100g'];
    const kcal = nutriments['energy_value'];

    const macro = {
      carbs,
      sugars,
      prots,
      fats,
      fattyAcids,
      kcal,
    }

    return macro;
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

  private normalizeImages(product: ApiTypes.Product): string[] {
    const imageUrls: string[] = [];
    const baseImageUrl = product.image_url;
    const nutritionImageUrl = product.image_nutrition_url;

    if (baseImageUrl) {
      imageUrls.push(baseImageUrl);
    }

    if (nutritionImageUrl) {
      imageUrls.push(nutritionImageUrl);
    }

    return imageUrls;
  }
  
}

const GRAM_UNIT = 'g';