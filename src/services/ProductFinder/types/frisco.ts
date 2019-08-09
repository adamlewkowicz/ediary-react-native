import { MacroElement, BarcodeId } from '../../../types';

export interface FriscoQueryResponse {
  products: {
    productId: FriscoProductId
    product: {
      ean: BarcodeId
      producer: string
      brand: string
      description: string
      imageUrl: string
      name: {
        pl: string
        en?: string
      }
      grammage: number
      contentData: {
        isSugarFree?: boolean
        sustenanceCalories?: number
        sustenanceCaloriesInUnit?: number
        sustenanceJoule?: number
        sustenanceJouleInUnit?: number
        components?: string[]
        substances?: {
          name: QuerySubstanceName
          quantity: number
          quantityInUnit: number
        }[]
      }
    }
  }[]
}

type QuerySubstanceName = 'białko' | 'węglowodany' | 'tłuszcz' | 'błonnik' | 'sód'

export type QueryMacroMap = {
  [key in QuerySubstanceName]: MacroElement
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
  productId: FriscoProductId
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

export interface FriscoProductId extends String {}