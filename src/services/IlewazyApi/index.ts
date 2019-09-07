import {
  IleWazyPayload,
  PortionMap,
  IleWazyPortionType,
  NormalizedProduct,
} from './types';
import { round } from '../../common/utils';
import { ProductUnit, PortionType } from '../../types';

export class IlewazyApi {

  private defaultPortion = 100;

  async findByName(name: string): Promise<NormalizedProduct[]> {
    const parsedName = encodeURIComponent(name);

    const response = await fetch(
      `http://www.ilewazy.pl/ajax/load-products/ppage/14/keyword/${parsedName}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    const { data = [] }: IleWazyPayload = await response.json();

    const portionMap: PortionMap = {
      'garsc': 'handful',
      'kromka': 'slice',
      'lyzka': 'spoon',
      'porcja': 'portion',
      'szklanka': 'glass',
      'sztuka': 'piece'
    }
    const knownPortionTypes = Object.keys(portionMap);

    const normalizedProducts = data.map(record => {
      const _id = record.id;
      let name = record.ingredient_name.replace('WA:ŻYWO', '').trim();
      const prots = Number(record.bialko);
      const kcal = Number(record.energia);
      let carbs = Number(record.weglowodany);
      let fats = Number(record.tluszcz);
      const unit: ProductUnit = 'g';
      const defaultPortionType: PortionType = 'portion';

      if (name.charAt(name.length - 1) === '.') {
        name = name.slice(0, -1);
      }

      if (record.simple_sugars) {
        const simpleSugars = Number(record.simple_sugars);
        if (!Number.isNaN(simpleSugars)) {
          carbs = round(carbs + simpleSugars, 100);
        }
      }
      if (record.fatty_acid) {
        const fattyAcid = Number(record.fatty_acid);
        if (!Number.isNaN(fattyAcid)) {
          fats = round(fats + fattyAcid, 100);
        }
      }

      const portions = Object
        .entries(record.unitdata)
        .filter(([key]) => knownPortionTypes.includes(key))
        .map(([key, data]) => ({
          type: portionMap[key as IleWazyPortionType] || defaultPortionType,
          value: Number(data!.unit_weight),
          unit,
        }));

      const portion = portions[0] ? portions[0].value : this.defaultPortion;

      const images = Object
        .values(record.unitdata)
        .map(unitdata => `http://static.ilewazy.pl/dziennik/470/${unitdata!.filename}`);

      const normalizedProduct: NormalizedProduct = {
        _id,
        name,
        portions,
        images,
        portion,
        macro: {
          prots,
          carbs,
          fats,
          kcal
        }
      }
      
      return normalizedProduct;
    });

    return normalizedProducts;
  }
}

export const ilewazyApi = new IlewazyApi;