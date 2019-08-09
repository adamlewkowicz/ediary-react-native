import { IleWazyPayload, PortionMap, IleWazyPortionType, NormalizedProduct, FriscoResponse, FriscoNutritionBrandbank } from './types';
import { round } from '../../common/utils';
import { BarcodeId, MacroElement, MacroElements, ProductUnit } from '../../types';
import { FriscoQueryResponse, FriscoProductId } from './types/frisco';
import { baseMacro } from '../../common/helpers';
import { PRODUCT_UNITS } from '../../common/consts';
import { UnsupportedUnitTypeError } from '../../common/error';

export class ProductFinder {

  private getNumAndUnitFromString(value: string): {
    value: number | null
    unit: ProductUnit | null
  } {
    const parseToNumber = (val: string): number | null => {
      const result = parseFloat(
        val.trim().replace(/,/, '.')
      );
      if (Number.isNaN(result)) {
        return null;
      }
      return result;
    }
    const unit = PRODUCT_UNITS.find(unit => value.includes(unit)) || null;
    const manyValues = value.split('/');

    if (manyValues.length > 1) {
      const result = parseToNumber(manyValues[manyValues.length - 1]);
      return {
        value: result,
        unit
      }
    }
    const result = parseToNumber(manyValues[0]);
  
    return {
      value: result,
      unit
    }
  }

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

  private async findOneByProductIdFrisco(
    productId: FriscoProductId
  ): Promise<NormalizedProduct | null> {

    const response = await fetch(
      `https://products.frisco.pl/api/products/get/${productId}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });

    const data: FriscoResponse = await response.json();
    const _id = data.productId;
    const name = data.officialProductName.replace(/\./, '');
    const description = data.description;
    const macroSectionId = 2;
    const macroData = data.brandbank.find(brand => brand.sectionId === macroSectionId);
    const images: [] = [];

    console.log(data)

    if (!macroData) {
      return null;
    }

    const macroMap: { [key: string]: MacroElement } = {
      'energia': 'kcal',
      'tłuszcz': 'fats',
      'w tym kwasy nasycone': 'fats',
      'węglowodany': 'carbs',
      'w tym cukry': 'carbs',
      'białko': 'prots',
    }

    const [firstField] = (macroData as FriscoNutritionBrandbank).fields;

    if (!firstField) {
      return null;
    }

    const { value } = this.getNumAndUnitFromString(firstField.content.Headings[0]);
    const portion = value || 100;

    const macro: MacroElements = firstField.content.Nutrients.reduce((macro, bank) => {
      const parsedName = bank.Name.toLowerCase().trim();
      const foundMacroElement = Object.entries(macroMap).find(([macroName]) => parsedName.includes(macroName));

      if (foundMacroElement) {
        const [, element] = foundMacroElement;
        const { value, unit } = this.getNumAndUnitFromString(bank.Values[0]);

        if (unit !== 'g') {
          return macro;
          throw new UnsupportedUnitTypeError;
        }
        if (value !== null) {
          macro[element] = round(macro[element] + value);
        }
      }
      return macro;
    }, { ...baseMacro });

    if (Object.values(macro).every(value => value === 0)) {
      return null;
    }

    return {
      _id,
      name,
      description,
      images,
      portion,
      ...macro
    }
  }

  private async findByPhraseFrisco(
    phrase: string | BarcodeId
  ) {
    const parsedPhrase = encodeURIComponent(phrase as string);

    const response = await fetch(
      `https://commerce.frisco.pl/api/offer/products/query?search=${parsedPhrase}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }}
    );

    const { products }: FriscoQueryResponse = await response.json();
    return products;
  }

  async findByBarcode(barcodeId: BarcodeId): Promise<NormalizedProduct | null> {
    const [firstProduct] = await this.findByPhraseFrisco(barcodeId);

    if (firstProduct) {
      const fetchedProduct = await this.findOneByProductIdFrisco(
        firstProduct.productId
      );
      return fetchedProduct;
    }
    return null;
  }

  private async findByBarcodeFrisco(barcodeId: BarcodeId): Promise<NormalizedProduct | null> {

    const response = await fetch(
      `https://commerce.frisco.pl/api/offer/products/query?search=${barcodeId}` +
      '&includeCategories=true&pageIndex=1&deliveryMethod=Van&pageSize=60' +
      '&language=pl&facetCount=100&includeWineFacets=false',
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }}
    );

    const data: FriscoQueryResponse = await response.json();

    if (!data.products.length) {
      return null;
    }

    const [{ product, productId: _productId }] = data.products;
    const { components = [], substances } = product.contentData;

    if (!substances || !substances.length || !product.contentData.sustenanceCalories) {
      return null;
    }

    const _id = _productId;
    const name = product.name.pl;
    const description = product.description;
    const barcode = product.ean;
    const images = product.imageUrl ? [product.imageUrl] : [];
    const ingredients = components.flatMap(ingredient =>
      ingredient.split(', ').map(ingrd =>
        ingrd.replace(/,/, '')
      )
    );
    const portion = Math.round(product.grammage * 1000);
    const brand = product.brand;
    const producer = product.producer;

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
        macro[element] = round(macro[element] + substance.quantity);
      }
      return macro;
    }, {
      ...baseMacro,
      kcal: product.contentData.sustenanceCalories
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
      ...macro
    }

    return normalizedProduct;
  }
}

export const productFinder = new ProductFinder();