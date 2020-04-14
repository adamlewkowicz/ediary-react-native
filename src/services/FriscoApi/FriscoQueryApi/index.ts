import { NormalizedProduct, MacroElement, MacroElements } from '../../../types';
import * as ApiTypes from './types';
import * as Utils from '../../../utils';
import { MACRO } from '../../../common/consts';

export class FriscoQueryApi {
  
  private readonly SEARCH_URL = 'https://commerce.frisco.pl/api/offer/products/query?search=';

  async find(query: string, controller?: AbortController): Promise<{
    normalized: NormalizedProduct[]
    unnormalized: ApiTypes.FriscoQueryResponse['products']
  }> {
    const parsedQuery = encodeURIComponent(query);

    const { products: unnormalized } = await Utils.fetchify<ApiTypes.FriscoQueryResponse>(
      `${this.SEARCH_URL}${parsedQuery}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller
    );

    const normalized = this.normalizeProducts(unnormalized);

    return { normalized, unnormalized };
  }
  
  private normalizeProducts(products: ApiTypes.FriscoQueryResponse['products']): NormalizedProduct[] {
    return products
      .map(product => this.normalizeProduct(product))
      .filter((product): product is NormalizedProduct => product !== null);
  }

  private normalizeProduct(product: ApiTypes.FriscoQueryResponseProduct): NormalizedProduct | null {
    const { product: data, productId } = product;
    const { components = [], substances, sustenanceCalories } = data.contentData;

    if (!substances || !substances.length || !sustenanceCalories) {
      return null;
    }

    const _id = productId;
    const name = data.name.pl;
    const description = data.description;
    const barcode = data.ean;
    const images = data.imageUrl ? [data.imageUrl] : [];
    const portion = Utils.round(data.grammage * MILIGRAMS_PER_GRAM);
    const brand = data.brand;
    const producer = data.producer;
    const portions: [] = [];
    const ingredients = this.normalizeProductIngredients(components);
    const macro = this.normalizeProductMacro(substances, sustenanceCalories);

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

    return normalizedProduct;
  }

  private normalizeProductMacro(substances: ApiTypes.ProductSubstance[], kcal: number): MacroElements {
    return substances.reduce((macro, substance) => {
      const element = MACRO_NAME_MAP[substance.name];

      if (element) {
        macro[element] = Utils.round(macro[element] + substance.quantity);
      }

      return macro;
    }, { ...MACRO, kcal });
  }

  private normalizeProductIngredients(components: string[]): string[] {
    return components.flatMap(ingredient =>
      ingredient
        .split(', ')
        .map(ingrd => ingrd.replace(/,/, ''))
    );
  }

}

const MACRO_NAME_MAP: { [key: string]: MacroElement } = {
  'węglowodany': 'carbs',
  'w tym cukry': 'carbs',
  'białko': 'prots',
  'tłuszcz': 'fats',
  ' tym kwasy tłuszczowe nasyconew': 'fats',
}

const MILIGRAMS_PER_GRAM = 1000;