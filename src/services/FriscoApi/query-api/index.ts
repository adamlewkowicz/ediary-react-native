import { NormalizedProduct, MacroElement, MacroElements } from '../../../types';
import { FriscoQueryResponse } from '../types';
import * as Utils from '../../../utils';
import { MACRO } from '../../../common/consts';

export class FriscoQueryApi {
  
  private readonly SEARCH_URL = 'https://commerce.frisco.pl/api/offer/products/query?search=';

  async find(query: string, controller?: AbortController): Promise<{
    normalized: NormalizedProduct[]
    unnormalized: FriscoQueryResponse['products']
  }> {
    const parsedQuery = encodeURIComponent(query);

    const { products: unnormalized } = await Utils.fetchify<FriscoQueryResponse>(
      `${this.SEARCH_URL}${parsedQuery}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller
    );

    const normalized = this.normalizeProducts(unnormalized);

    return { normalized, unnormalized };
  }

  private normalizeProducts(products: FriscoQueryResponse['products']): NormalizedProduct[] {
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