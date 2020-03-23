import {
  IleWazyPayload,
  IleWazyPortionType,
  NormalizedProduct,
  IleWazyItem,
  IleWazyUnitData,
} from './types';
import { PortionUnit, PortionType } from '../../types';
import { Product } from '../../database/entities';
import { KNOWN_PORTION_TYPES, PORTION_MAP } from './consts';
import * as Utils from '../../utils';

export class IlewazyApi {

  private static searchURL = 'http://www.ilewazy.pl/ajax/load-products/ppage/14/keyword/';
  private static imageURL = 'http://static.ilewazy.pl/dziennik/470/';

  async findByName(
    name: string,
    controller?: AbortController
  ): Promise<NormalizedProduct[]> {
    const parsedName = encodeURIComponent(name);

    const { data = [] } = await Utils.fetchify<IleWazyPayload>(
      `${IlewazyApi.searchURL}${parsedName}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller,
    );

    return data.map(this.normalizeProduct);
  }

  private normalizeProduct(payload: IleWazyItem): NormalizedProduct {
    const _id = payload.id;
    let name = payload.ingredient_name.replace('WA:ŻYWO', '').trim();
    const prots = Number(payload.bialko);
    const kcal = Number(payload.energia);
    let carbs = Number(payload.weglowodany);
    let fats = Number(payload.tluszcz);
    const unit: PortionUnit = 'g';
    const defaultPortionType: PortionType = 'portion';

    if (name.charAt(name.length - 1) === '.') {
      name = name.slice(0, -1);
    }

    if (payload.simple_sugars) {
      const simpleSugars = Number(payload.simple_sugars);
      if (!Number.isNaN(simpleSugars)) {
        carbs = Utils.round(carbs + simpleSugars, 100);
      }
    }
    if (payload.fatty_acid) {
      const fattyAcid = Number(payload.fatty_acid);
      if (!Number.isNaN(fattyAcid)) {
        fats = Utils.round(fats + fattyAcid, 100);
      }
    }

    const portions = Object
      .entries(payload.unitdata)
      .filter(([key]) => KNOWN_PORTION_TYPES.includes(key))
      .map(([key, data]) => ({
        type: PORTION_MAP[key as IleWazyPortionType] || defaultPortionType,
        value: Number(data!.unit_weight),
        unit,
      }));

    const [firstPortion] = portions;
    const defaultPortion = firstPortion?.value ?? Product.defaultPortion;

    const images = Object
      .values(payload.unitdata)
      .filter((unitdata): unitdata is IleWazyUnitData => typeof unitdata?.filename === 'string')
      .map(unitdata => `${IlewazyApi.imageURL}${unitdata.filename}`);

    const macro = { prots, carbs, fats, kcal };

    const normalizedProduct: NormalizedProduct = {
      _id,
      name,
      macro,
      portions,
      images,
      portion: defaultPortion,
    }
    
    return normalizedProduct;
  }
}

export const ilewazyApi = new IlewazyApi;