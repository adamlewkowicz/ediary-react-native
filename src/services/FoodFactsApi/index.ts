import { BarcodeId, NormalizedProduct, MacroElements } from '../../types';
import * as Utils from '../../utils';
import { Product } from '../../database/entities';
import { name as appName } from '../../../app.json';
import { version as appVersion } from '../../../package.json';
import { Platform } from 'react-native';
import { OpenFoodFactsApi, ApiTypes } from 'openfoodfac-ts';

export class FoodFactsApi {

  openFoodFactsApi = new OpenFoodFactsApi({
    country: 'pl',
    userAgent: `UserAgent: ${appName} - ${Platform.OS} - Version ${appVersion} -`
  });
  
  async findOneByBarcode(
    barcode: BarcodeId,
    controller: AbortController
  ): Promise<NormalizedProduct | null> {

    const product = await this.openFoodFactsApi
      .setController(controller)
      .findProductByBarcode(barcode as string);

    if (product === null) {
      return null;
    }

    return this.normalizeProduct(product);
  }

  async findByName(
    name: string,
    controller: AbortController
  ): Promise<NormalizedProduct[]> {

    const { products } = await this.openFoodFactsApi
      .setController(controller)
      .findProductsBySearchTerm(name);

    return this.normalizeProducts(products);
  }

  private normalizeProducts(products: ApiTypes.Product[]): NormalizedProduct[] {
    return products.flatMap(product => this.normalizeProduct(product) ?? []);
  }

  private normalizeProduct(product: ApiTypes.Product): NormalizedProduct | null {
    if (
      Utils.isNil(product._id) ||
      Utils.isNil(product.product_name_pl) ||
      Utils.isNil(product.product_name) ||
      Utils.isNil(product.nutriments)
    ) {
      return null;
    }

    const macro = this.normalizeMacro(product.nutriments);

    if (macro === null) {
      return null;
    }

    const _id = product._id;
    const name = product.product_name_pl;
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

  private normalizeMacro(nutriments: ApiTypes.Nutriments): MacroElements | null {
    const carbs = nutriments['carbohydrates_100g'];
    const sugars = nutriments['sugars_100g'];
    const prots = nutriments['proteins_100g'];
    const fats = nutriments['fat_100g'];
    const fattyAcids = nutriments['saturated-fat_100g'];
    const kcal = nutriments['energy_value'];

    const baseMacro = { carbs, prots, fats, kcal };

    if (
      Utils.isNil(baseMacro.carbs) ||
      Utils.isNil(baseMacro.prots) ||
      Utils.isNil(baseMacro.fats) ||
      Utils.isNil(baseMacro.kcal)
    ) {
      return null;
    }

    const macro = {
      ...baseMacro as MacroElements,
      sugars,
      fattyAcids,
    }

    return macro;
  }

  private normalizePortion(servingSize?: string): number {
    if (servingSize?.includes(GRAM_UNIT)) {
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