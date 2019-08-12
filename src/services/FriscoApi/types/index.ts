import { BarcodeId } from '../../../types';
import { FriscoProductId } from './frisco';

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
  portion: number
  prots: number
  carbs: number
  fats: number
  kcal: number
  images: string[]
  barcode?: BarcodeId
  producer?: string
  description?: string
  ingredients?: string[]
}