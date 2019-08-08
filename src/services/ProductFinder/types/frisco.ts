import { MacroElement } from '../../../types';

export interface FriscoQueryResponse {
  products: {
    productId: string
    product: {
      ean?: string
      producer: string

    }
  }[]
}

export type FriscoNutritionName =
  | 'Energia' | 'Tłuszcz ' | ' w tym kwasy nasycone '
  | 'Węglowodany ' | ' w tym cukry ' | 'Białko '
  // | 'Sól '

export interface FriscoNutritionBrand {
  sectionId: 2
  sectionName: 'Wartości odżywcze'
  content: {
    Headings: string[]
    Nutrients: {
      Name: FriscoNutritionName
      Values: string[]
    }[]
  }
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
  brandbank: ({
    sectionId: 2
    sectionName: 'Wartości odżywcze'
    content: {
      Headings: string[]
      Nutrients: {
        Name: FriscoNutritionName
        Values: string[]
      }[]
    }
  } | {
    sectionId: 3
    sectionName: 'Informacje producenta'
    fields: [
      {
        fieldId: 25
        fieldName: 'Marka'
        content: string[]
      }
    ]
  })[]
}

export type FriscoMacroMap = {
  [key in FriscoNutritionName]: MacroElement
}