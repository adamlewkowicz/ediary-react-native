import { PortionType, BarcodeId, ProductUnit } from '../../../types';
import { FriscoProductId } from './frisco';

type IleWazyUnitData = {
  filename: "koncentrat-grzybowy-krakus-1.jpg"
  id: string
  id_iu: string
  /** "porcja-koncentratu-zupy-grzybowej" */
  post_name: string
  /** "Porcja" */
  unit_name: string
  /** "300" */
  unit_weight: string
}

export type IleWazyPortionType = 'szklanka' | 'porcja' | 'sztuka' | 'kromka' | 'lyzka' | 'garsc';

export interface IleWazyPayload {
  page: null
  records: string
  total: number
  data?: {
    /** Product name */
    ingredient_name: string
    weglowodany: string
    simple_sugars: null | string
    tluszcz: string
    fatty_acid: null | string
    bialko: string
    energia: string
    weight: string

    blonnik: null | string
    category_extended_content: null | string
    category_name: null | string
    category_slug: null | string
    id: string
    id_iu: null | string
    post_name: null | string
    product_slug: null | string
    salt: null | string
    unitdata: {
      [key in IleWazyPortionType | string]?: IleWazyUnitData
    }
  }[]
}

export type PortionMap = {
  [key in IleWazyPortionType]: PortionType
}

type FriscoFieldType = 'LongTextItems' | 'FrontOfPackGDA' | 'TextualNutrition' | string

type FriscoNutritionName = 'Energia' | 'Tłuszcz ' | ' w tym kwasy nasycone ' | 'Węglowodany ' | ' w tym cukry ' | 'Białko ' | 'Sól '

interface FriscoField {
  fieldId: number,
  fieldName: string
  contentType: FriscoFieldType
}

interface FriscoLongTextItemField extends FriscoField {
  contentType: 'LongTextItems',
  content: string[]
}

interface FriscoFrontOfPackGDAField extends FriscoField {
  contentType: 'FrontOfPackGDA'
  content: {
    "Reference": string,
    "Headers": string[],
    "Wartość energetyczna": {
      "Quantity": string,
      "Percentage": string,
      "Rating": null
    },
    "Footers": string[]
  }
}

interface FriscoTextualNutritionField extends FriscoField {
  contentType: 'TextualNutrition'
  content: {
    "Headings": string[],
    "Nutrients": {
      Name: FriscoNutritionName
      Values: string[]
    }[]
  }
}

interface FirscoBrandbank {
  sectionId: number
  sectionName: string
  fields: (FriscoLongTextItemField | FriscoFrontOfPackGDAField | FriscoTextualNutritionField)[]
}

interface FriscoIngredientsBrandbank extends FirscoBrandbank {
  sectionId: 1
  sectionName: 'Składniki'
  // fields: (FriscoFrontOfPackGDAField | FriscoLongTextItemField)[]
}

export interface FriscoNutritionBrandbank extends FirscoBrandbank {
  sectionId: 2
  sectionName: 'Wartości odżywcze',
  fields: FriscoTextualNutritionField[]
}

export interface FriscoResponse {
  productId: number
  seoData: {
    title: string
    description: string
    imgAlt: string
  },
  description: string
  officialProductName: string
  brandbank: (
    | FriscoIngredientsBrandbank
    | FriscoNutritionBrandbank
  )[]
}

export interface NormalizedProduct {
  _id: string | number | FriscoProductId
  name: string
  portion: number | null
  prots: number
  carbs: number
  fats: number
  kcal: number
  unit?: ProductUnit | null
  images?: string[]
  barcode?: BarcodeId
  producer?: string
  description?: string
  ingredients?: string[]
}