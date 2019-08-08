import { IleWazyPayload, PortionMap, IleWazyPortionType, NormalizedProduct } from './types';
import { round, getValAndUnitFromString } from '../../common/utils';
import { BarcodeId, MacroElement } from '../../types';
import { FriscoResponse, FriscoNutritionBrand, FriscoNutritionName, FriscoMacroMap } from './types/frisco';
import { baseMacro } from '../../common/helpers';

export class ProductFinder {
  async findByName(name: string) {
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

    const normalizedResults = data.map(record => {
      const _id = record.id;
      let name = record.ingredient_name.replace('WA:ŻYWO', '').trim();
      const prots = Number(record.bialko);
      const kcal = Number(record.energia);
      const portion = Number(record.weight);
      const isVerified = true as const;
      let carbs = Number(record.weglowodany);
      let fats = Number(record.tluszcz);

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
          type: portionMap[key as IleWazyPortionType],
          value: Number(data!.unit_weight)
        }));

      const images = Object
        .values(record.unitdata)
        .map(unitdata => `http://static.ilewazy.pl/dziennik/470/${unitdata!.filename}`);

      const normalizedProduct = {
        _id,
        name,
        portion,
        prots,
        carbs,
        fats,
        kcal,
        portions,
        images,
        isVerified,
      }
      
      return normalizedProduct;
    });

    return normalizedResults;
  }

  async findByBarcode(
    barcode: BarcodeId, productId: number
  ): Promise<NormalizedProduct | null> {

    const response = await fetch(
      `https://products.frisco.pl/api/products/get/${productId}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });

    const data: FriscoResponse = await response.json();

    const _id = data.productId;
    const name = data.seoData.title;
    const description = data.seoData.description;

    const macroData = data.brandbank.find(brand =>
      brand.sectionName === 'Wartości odżywcze'
    ) as FriscoNutritionBrand;

    if (!macroData) {
      return null;
    }

    const macroMap: FriscoMacroMap = {
      'Energia': 'kcal',
      'Tłuszcz ': 'fats',
      ' w tym kwasy nasycone ': 'fats',
      'Węglowodany ': 'carbs',
      ' w tym cukry ': 'carbs',
      'Białko ': 'prots',
    }

    const macro = macroData.content.Nutrients.reduce((macro, data) => {
      const [firstValue] = data.Values;
      const { value } = getValAndUnitFromString(firstValue);
      const element = macroMap[data.Name];

      if (element && value !== null) {
        macro[element] = round(macro[element] + value);
      }

      return macro;
    }, { ...baseMacro });

    const normalizedProduct = {
      _id,
      name,
      description,
      
      ...macro,
    }

    return normalizedProduct;
  }
}

export const productFinder = new ProductFinder();