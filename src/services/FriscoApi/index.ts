import { BarcodeId, MacroElement, MacroElements, ProductPortionType, NormalizedProduct } from '../../types';
import { FriscoResponse, FriscoNutritionBrandbank } from './types/response';
import { FriscoProductId } from './types/common';
import { FriscoQueryResponse } from './types';
import { Product } from '../../database/entities';
import * as Utils from '../../utils';
import { MACRO } from '../../common/consts';

export class FriscoApi {

  readonly #SEARCH_URL = 'https://commerce.frisco.pl/api/offer/products/query?search=';

  private async findAndParseByQuery(
    query: string | BarcodeId,
    controller?: AbortController
  ): Promise<{
    raw: FriscoQueryResponse['products']
    normalized: NormalizedProduct[]
  }> {
    const parsedQuery = encodeURIComponent(query as string);

    const { products: raw } = await Utils.fetchify<FriscoQueryResponse>(
      `${this.#SEARCH_URL}${parsedQuery}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller
    );

    const normalized = this.normalizeQueryProducts(raw);

    return {
      normalized,
      raw
    }
  }

  async findByQuery(
    query: BarcodeId | string,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const { normalized, raw } = await this.findAndParseByQuery(query, controller);

    if (!normalized.length && raw.length) {
      const [firstRawProduct] = raw;

      const foundProduct = await this.findOneByProductId(
        firstRawProduct.productId,
        controller,
      );

      return foundProduct ? [foundProduct] : [];
    }

    return normalized; 
  }

  async findOneByProductId(
    productId: FriscoProductId,
    controller?: AbortController
  ): Promise<NormalizedProduct | null> {

    const data = await Utils.fetchify<FriscoResponse>(
      `https://products.frisco.pl/api/products/get/${productId}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller
    );

    const MACRO_SECTION_ID = 2;
    const MACRO_FIELD_ID = 85;
    const macroSection = data.brandbank.find(brand =>
      brand.sectionId === MACRO_SECTION_ID
    );
    
    if (!macroSection) {
      return null;
    }

    const macroField = (macroSection as any as FriscoNutritionBrandbank).fields.find(field => 
      field.fieldId === MACRO_FIELD_ID
    );

    if (!macroField) {
      return null;
    }

    const [portionHeading] = macroField.content.Headings;

    if (!portionHeading) {
      return null;
    }

    const {
      value: nullablePortion,
      unit
    } = Utils.getNumAndUnitFromString(portionHeading);

    const portion = nullablePortion ?? Product.defaultPortion;

    if (unit !== 'g' && unit !== 'ml') {
      return null;
    }

    const macroMap: { [key: string]: MacroElement } = {
      'wartość energetyczna': 'kcal',
      'energia': 'kcal',
      'tłuszcz': 'fats',
      'w tym kwasy nasycone': 'fats',
      'węglowodany': 'carbs',
      'w tym cukry': 'carbs',
      'białko': 'prots',
    }

    const macro: MacroElements = macroField.content.Nutrients.reduce((macro, bank) => {
      const parsedName = bank.Name.toLowerCase().trim();
      const foundMacroElement = Object.entries(macroMap).find(([macroName]) => parsedName.includes(macroName));

      if (foundMacroElement) {
        const [, element] = foundMacroElement;
        const { value, unit: elementUnit } = Utils.getNumAndUnitFromString(bank.Values[0]);

        if (elementUnit !== 'g' && element !== 'kcal') {
          return macro;
        }
        if (value !== null) {
          macro[element] = Utils.round(macro[element] + value);
        }
      }
      return macro;
    }, { ...MACRO });

    if (Utils.eachValueEqualsZero(macro)) {
      return null;
    }

    const _id = data.productId;
    const name = data.officialProductName.replace(/\./, '');
    const description = data.description;
    const portions = macroField.content.Headings.flatMap(heading => {
      const { value, unit } = Utils.getNumAndUnitFromString(heading);

      if ((unit === 'g' || unit === 'ml') && value !== null) {
        const type: ProductPortionType = 'portion';
        return [{
          type,
          value,
          unit
        }];
      }

      return [];
    });

    return {
      _id,
      name,
      description,
      portion,
      portions,
      unit,
      macro,
    }
  }

  private normalizeQueryProducts(
    products: FriscoQueryResponse['products']
  ): NormalizedProduct[] {
    return products.flatMap(data => {
      const { product, productId } = data;
      const { components = [], substances, sustenanceCalories } = product.contentData;
  
      if (!substances || !substances.length || !sustenanceCalories) {
        return [];
      }
  
      const _id = productId;
      const name = product.name.pl;
      const description = product.description;
      const barcode = product.ean;
      const images = product.imageUrl ? [product.imageUrl] : [];
      const ingredients = components.flatMap(ingredient =>
        ingredient.split(', ').map(ingrd =>
          ingrd.replace(/,/, '')
        )
      );
      const portion = Utils.round(product.grammage * 1000);
      const brand = product.brand;
      const producer = product.producer;
      const portions: [] = [];
  
      const macroMap: { [key: string]: MacroElement } = {
        'węglowodany': 'carbs',
        'w tym cukry': 'carbs',
        'białko': 'prots',
        'tłuszcz': 'fats',
        'w tym kwasy tłuszczowe nasycone': 'fats',
      }
  
      const macro: MacroElements = substances.reduce((macro, substance) => {
        const element = macroMap[substance.name];
        if (element) {
          macro[element] = Utils.round(macro[element] + substance.quantity);
        }
        return macro;
      }, {
        ...MACRO,
        kcal: sustenanceCalories
      });
  
      const normalizedProduct = {
        _id, 
        name, 
        description,
        barcode,
        images,
        ingredients,
        portion,
        brand,
        producer,
        portions,
        macro,
      }
  
      return [normalizedProduct];
    });
  }

}

export const friscoApi = new FriscoApi;