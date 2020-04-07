import * as ApiTypes from './types';
import { ProductUnitType, NormalizedProduct, NormalizedPortions } from '../../types';
import { Product } from '../../database/entities';
import { KNOWN_PORTION_TYPES, KNOWN_PORTION_MAP } from './consts';
import * as Utils from '../../utils';

export class IlewazyApi {

  private readonly SEARCH_URL = 'http://www.ilewazy.pl/ajax/load-products/ppage/14/keyword/';
  
  private readonly IMAGE_URL = 'http://static.ilewazy.pl/dziennik/470/';
  
  private readonly PRODUCT_NAME_CLUTTERED_PHRASE = 'WA:ŻYWO';

  async findByName(
    name: string,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const parsedName = encodeURIComponent(name);

    const { data = [] } = await Utils.fetchify<ApiTypes.SearchPayload>(
      `${this.SEARCH_URL}${parsedName}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller,
    );

    const normalizedProducts = this.normalizeProducts(data);

    return normalizedProducts;
  }

  private normalizeProducts(data: ApiTypes.ProductItem[]): NormalizedProduct[] {
    return data.map(payload => this.normalizeProduct(payload));
  }

  private normalizeProduct(payload: ApiTypes.ProductItem): NormalizedProduct {
    const _id = payload.id;
    let name = payload.ingredient_name
      .replace(this.PRODUCT_NAME_CLUTTERED_PHRASE, '')
      .trim();
    const prots = Number(payload.bialko);
    const kcal = Number(payload.energia);
    const simpleSugars = Number(payload.simple_sugars);
    const fattyAcid = Number(payload.fatty_acid);
    let carbs = Number(payload.weglowodany);
    let fats = Number(payload.tluszcz);

    const unit: ProductUnitType = 'g';

    if (Utils.isLastCharEqual(name, '.')) {
      name = name.slice(0, -1);
    }

    if (Utils.isANumber(simpleSugars)) {
      carbs = Utils.round(carbs + simpleSugars, 100);
    }

    if (Utils.isANumber(fattyAcid)) {
      fats = Utils.round(fats + fattyAcid, 100);
    }

    const unitData = this.normalizeUnitData(payload.unitdata);

    const { portions, defaultPortionQuantity } = this.normalizePortionData(unitData, unit);

    const images = unitData.map(([, data]) => `${this.IMAGE_URL}${data.filename}`);

    const macro = { prots, carbs, fats, kcal };

    const normalizedProduct: NormalizedProduct = {
      _id,
      name,
      macro,
      portions,
      images,
      portion: defaultPortionQuantity,
    }
    
    return normalizedProduct;
  }

  private normalizeUnitData(data: ApiTypes.ProductItem['unitdata']): UnitDataEntry[] {
    return Object
      .entries(data)
      .filter((entry): entry is UnitDataEntry => {
        const [portionType, data] = entry;
        const isKnownPortionType = KNOWN_PORTION_TYPES.includes(
          portionType as ApiTypes.PortionType
        );

        return isKnownPortionType && data != null;
      });
  }

  private normalizePortionData(
    unitData: UnitDataEntry[],
    unit: ProductUnitType
  ): { defaultPortionQuantity: number, portions: NormalizedPortions } {

    const portions = unitData
      .map(([portionType, data]) => ({
        type: KNOWN_PORTION_MAP[portionType],
        value: Number(data?.unit_weight),
        unit,
      }))
      .filter(portion => Utils.isANumber(portion.value));

    const [firstPortion] = portions;
    const defaultPortionQuantity = firstPortion?.value ?? Product.defaultPortion;

    return {
      defaultPortionQuantity,
      portions,
    }
  }
}

export const ilewazyApi = new IlewazyApi;

type UnitDataEntry = [ApiTypes.PortionType, ApiTypes.UnitData]