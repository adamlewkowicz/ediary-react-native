import * as Utils from '../../../utils';
import { FriscoResponse, FriscoProductId, FriscoNutritionBrandbank } from '../types';
import { NormalizedProduct, MacroElement, MacroElements, ProductPortionType } from '../../../types';
import { Product } from '../../../database/entities';
import { MACRO } from '../../../common/consts';

export class FriscoProductIdApi {

  private searchURL = 'https://products.frisco.pl/api/products/get/';
  
  async findOne(productId: FriscoProductId, controller?: AbortController): Promise<NormalizedProduct | null> {

    const data = await Utils.fetchify<FriscoResponse>(
      `${this.searchURL}${productId}`,
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
}