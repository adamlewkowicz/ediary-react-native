import { BarcodeId, MacroElement, MacroElements } from '../../types';
import { FriscoQueryResponse } from './types/frisco';
import { NormalizedProduct } from './types';
import { FriscoProductId, FriscoResponse } from '../ProductFinder/types/frisco';
import { round, getNumAndUnitFromString } from '../../common/utils';
import { baseMacro } from '../../common/helpers';
import { FriscoNutritionBrandbank } from '../ProductFinder/types';

export class FriscoApi {

  async findByQuery(
    query: string | BarcodeId
  ): Promise<{
    raw: FriscoQueryResponse['products']
    normalized: NormalizedProduct[]
  }> {
    const parsedQuery = encodeURIComponent(query as string);

    const response = await fetch(
      `https://commerce.frisco.pl/api/offer/products/query?search=${parsedQuery}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }}
    );
    const data: FriscoQueryResponse = await response.json();

    const raw = data.products;
    const normalized = this.normalizeQueryProducts(raw);

    return {
      normalized,
      raw
    }
  }

  async findByBarcode(barcodeId: BarcodeId): Promise<NormalizedProduct[]> {
    const { normalized, raw } = await this.findByQuery(barcodeId);

    if (!normalized.length && raw.length) {
      const [firstRawProduct] = raw;
      const foundProduct = await this.findOneByProductId(firstRawProduct.productId);
      return foundProduct ? [foundProduct] : [];
    }

    return normalized;
  }

  async findOneByProductId(
    productId: FriscoProductId
  ): Promise<NormalizedProduct | null> {

    const response = await fetch(
      `https://products.frisco.pl/api/products/get/${productId}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });

    const data: FriscoResponse = await response.json();
    const _id = data.productId;
    const name = data.officialProductName.replace(/\./, '');
    const description = data.description;
    const macroSectionId = 2;
    const macroData = data.brandbank.find(brand => brand.sectionId === macroSectionId);
    const images: [] = [];

    if (!macroData) {
      return null;
    }

    const macroMap: { [key: string]: MacroElement } = {
      'energia': 'kcal',
      'tłuszcz': 'fats',
      'w tym kwasy nasycone': 'fats',
      'węglowodany': 'carbs',
      'w tym cukry': 'carbs',
      'białko': 'prots',
    }

    const [firstField] = (macroData as FriscoNutritionBrandbank).fields;

    if (!firstField) {
      return null;
    }

    const { value } = getNumAndUnitFromString(firstField.content.Headings[0]);
    const portion = value || 100;

    const macro: MacroElements = firstField.content.Nutrients.reduce((macro, bank) => {
      const parsedName = bank.Name.toLowerCase().trim();
      const foundMacroElement = Object.entries(macroMap).find(([macroName]) => parsedName.includes(macroName));

      if (foundMacroElement) {
        const [, element] = foundMacroElement;
        const { value, unit } = getNumAndUnitFromString(bank.Values[0]);

        // if (unit !== 'g') {
        //   return macro;
        // }
        if (value !== null) {
          macro[element] = round(macro[element] + value);
        }
      }
      return macro;
    }, { ...baseMacro });

    if (Object.values(macro).every(value => value === 0)) {
      return null;
    }

    return {
      _id,
      name,
      description,
      images,
      portion,
      ...macro
    }
  }

  normalizeQueryProducts(
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
      const portion = Math.round(product.grammage * 1000);
      const brand = product.brand;
      const producer = product.producer;
  
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
          macro[element] = round(macro[element] + substance.quantity);
        }
        return macro;
      }, {
        ...baseMacro,
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
        ...macro
      }
  
      return [normalizedProduct];
    });
  }
  
}

export const friscoApi = new FriscoApi;