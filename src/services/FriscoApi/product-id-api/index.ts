import * as Utils from '../../../utils';
import * as ApiTypes from '../types';
import { NormalizedProduct, MacroElement, MacroElements, ProductPortionType, NormalizedPortion } from '../../../types';
import { Product } from '../../../database/entities';
import { MACRO } from '../../../common/consts';

export class FriscoProductIdApi {

  private searchURL = 'https://products.frisco.pl/api/products/get/';

  async findOne(productId: ApiTypes.FriscoProductId, controller?: AbortController): Promise<NormalizedProduct | null> {
    
    const data = await Utils.fetchify<ApiTypes.FriscoResponse>(
      `${this.searchURL}${productId}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }},
      controller
    );

    return this.normalizeProduct(data);
  }

  private normalizeProduct(data: ApiTypes.FriscoResponse): NormalizedProduct | null {
    const macroField = this.getProductMacroField(data);

    if (macroField == null) {
      return null;
    }

    const normalizedBasePortion = this.normalizeProductBasePortion(macroField);

    if (normalizedBasePortion == null) {
      return null;
    }

    const _id = data.productId;
    const name = data.officialProductName.replace(/\./, '');
    const description = data.description;
    const portions = this.normalizeProductPortions(macroField);
    const macro = this.normalizeProductMacro(macroField);

    if (Utils.eachValueEqualsZero(macro)) {
      return null;
    }

    const normalizedProduct: NormalizedProduct = {
      _id,
      name,
      description,
      portions,
      macro,
      ...normalizedBasePortion
    }

    return normalizedProduct;
  }

  private getProductMacroField(data: ApiTypes.FriscoResponse): ApiTypes.MacroField | null {
    const MACRO_SECTION_ID = 2;
    const MACRO_FIELD_ID = 85;
    const macroSection = data.brandbank.find(brand => brand.sectionId === MACRO_SECTION_ID);
    
    if (macroSection?.sectionId !== MACRO_SECTION_ID) {
      return null;
    }

    const macroField = macroSection.fields.find(field => field.fieldId === MACRO_FIELD_ID);

    if (macroField == null) {
      return null;
    }

    return macroField;
  }

  private normalizeProductBasePortion(macroField: ApiTypes.MacroField): NormalizedBasePortion | null {
    const [portionHeading] = macroField.content.Headings;

    if (!portionHeading) {
      return null;
    }

    const { value, unit } = Utils.getNumAndUnitFromString(portionHeading);
    const portion = value ?? Product.defaultPortion;

    if (this.isKnownUnitType(unit)) {
      return { portion, unit };
    }
    
    return null;
  }

  private normalizeProductPortions(macroField: ApiTypes.MacroField): NormalizedPortion[] {
    return macroField.content.Headings
      .map(heading => {
        const { value, unit } = Utils.getNumAndUnitFromString(heading);

        if (value != null && this.isKnownUnitType(unit)) {
          const type: ProductPortionType = 'portion';

          const normalizedPortion: NormalizedPortion = {
            type,
            value,
            unit
          }

          return normalizedPortion;
        }

        return null;
      })
      .filter((portionData): portionData is NormalizedPortion => portionData !== null);
  }

  private isKnownUnitType(unitType: string | null): unitType is KnownUnitType {
    return unitType === UNIT_GRAM;
  }

  private normalizeProductMacro(macroField: ApiTypes.MacroField): MacroElements {
    return macroField.content.Nutrients.reduce((macro, bank) => {
      const parsedName = bank.Name.toLowerCase().trim();
      const foundMacroElement = Object.entries(MACRO_NAME_MAP).find(([macroName]) => parsedName.includes(macroName));

      if (foundMacroElement) {
        const [, element] = foundMacroElement;
        const { value, unit: elementUnit } = Utils.getNumAndUnitFromString(bank.Values[0]);
        const isUnknownUnitType = !this.isKnownUnitType(elementUnit);

        if (isUnknownUnitType && element !== 'kcal') {
          return macro;
        }
        if (value !== null) {
          macro[element] = Utils.round(macro[element] + value);
        }
      }
      return macro;
    }, { ...MACRO });
  }

}

const MACRO_NAME_MAP: { [key: string]: MacroElement } = {
  'wartość energetyczna': 'kcal',
  'energia': 'kcal',
  'tłuszcz': 'fats',
  'w tym kwasy nasycone': 'fats',
  'węglowodany': 'carbs',
  'w tym cukry': 'carbs',
  'białko': 'prots',
}

const UNIT_GRAM = 'g';

type KnownUnitType = 'g' | 'ml'

type NormalizedBasePortion = {
  portion: number
  unit: 'g' | 'ml'
}