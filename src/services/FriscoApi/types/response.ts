import { FriscoProductId } from './common';

export interface FriscoResponse {
  productId: FriscoProductId
  seoData: {
    title: string
    description: string
    imgAlt: string
  },
  description: string
  officialProductName: string
  brandbank: (
    FriscoNutritionBrandbank | {
      sectionId: 3
      sectionName: 'Informacje producenta'
      fields: [
        {
          fieldId: 25
          fieldName: 'Marka'
          content: string[]
        }
      ]
    }
  )[]
}

export interface FriscoNutritionBrandbank extends FriscoBrandbank {
  sectionId: 2
  sectionName: 'Wartości odżywcze'
  fields: {
    fieldId: 85
    fieldName: 'Wartości odżywcze'
    content: {
      Headings: string[]
      Nutrients: {
        Name: FriscoNutritionName
        Values: string[]
      }[]
    }
  }[]
}

interface FriscoBrandbank {
  fieldId: number
  fieldName: string
  fields: {
    fieldId: number
    fieldName: string
    content: any
  }[]
}

type FriscoNutritionName =
  | 'Energia' | 'Tłuszcz ' | ' w tym kwasy nasycone '
  | 'Węglowodany ' | ' w tym cukry ' | 'Białko '