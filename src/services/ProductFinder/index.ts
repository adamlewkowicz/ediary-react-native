import { IleWazyPayload } from './types';
import { round } from '../../common/utils';

export class ProductFinder {
  async findByName(name: string) {
    const parsedName = encodeURIComponent(name);

    const response = await fetch(
      `http://www.ilewazy.pl/ajax/load-products/ppage/14/keyword/${parsedName}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });

    const result: IleWazyPayload = await response.json();

    const normalizedResults = result.data.map(record => {
      const _id = record.id;
      const name = record.ingredient_name;
      const prots = Number(record.bialko);
      const kcal = Number(record.energia);
      const portion = Number(record.weight);
      let carbs = Number(record.weglowodany);
      let fats = Number(record.tluszcz);

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

      const normalizedProduct = {
        _id,
        name,
        portion,
        prots,
        carbs,
        fats,
        kcal,
      }
      
      return normalizedProduct;
    });

    return normalizedResults;
  }
}

export const productFinder = new ProductFinder();