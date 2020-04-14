import * as ApiTypes from './types';
import { ProductUnitType, NormalizedProduct, NormalizedPortions, MacroElements } from '../../types';
import { Product } from '../../database/entities';
import { KNOWN_PORTION_TYPES, KNOWN_PORTION_MAP } from './consts';
import * as Utils from '../../utils';

export class IlewazyApi {

  private readonly SEARCH_URL = 'http://www.ilewazy.pl/ajax/load-products/ppage/14/keyword/';
  
  async findByName(name: string, controller?: AbortController): Promise<NormalizedProduct[]> {
    const parsedName = encodeURIComponent(name);

    const { data = [] } = await Utils.fetchify<ApiTypes.Response>(
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
    const name = this.normalizeProductName(payload.ingredient_name);
    const macro = this.normalizeProductMacro(payload);
    const unitData = this.normalizeUnitData(payload.unitdata);
    const { portions, defaultPortionQuantity } = this.normalizePortionData(unitData);
    const images = this.normalizeProductImages(unitData);

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
  
  private normalizeProductName(name: string): string {
    const CLUTTERED_PHRASE = 'WA:ŻYWO';

    let normalizedName = name 
      .replace(CLUTTERED_PHRASE, '')
      .trim();

    if (Utils.isLastCharEqual(normalizedName, '.')) {
      normalizedName = normalizedName.slice(0, -1);
    }

    return normalizedName;
  }

  private normalizeProductMacro(data: ApiTypes.ProductItem): MacroElements {
    const prots = Number(data.bialko);
    const kcal = Number(data.energia);
    const simpleSugars = Number(data.simple_sugars);
    const fattyAcid = Number(data.fatty_acid);
    let carbs = Number(data.weglowodany);
    let fats = Number(data.tluszcz);

    if (Utils.isANumber(simpleSugars)) {
      carbs = Utils.round(carbs + simpleSugars, 100);
    }

    if (Utils.isANumber(fattyAcid)) {
      fats = Utils.round(fats + fattyAcid, 100);
    }

    return { carbs, prots, fats, kcal };
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
    unit: ProductUnitType = 'g'
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

  private normalizeProductImages(unitData: UnitDataEntry[]): string[] {
    const IMAGE_URL = 'http://static.ilewazy.pl/dziennik/470/';

    return unitData.map(([, data]) => `${IMAGE_URL}${data.filename}`);
  }
}

type UnitDataEntry = [ApiTypes.PortionType, ApiTypes.UnitData]