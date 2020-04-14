
export interface Response {
  productId: FriscoProductId
  seoData: {
    title: string
    description: string
    imgAlt: string
  },
  description: string
  officialProductName: string
  brandbank: Brandbank[]
}

type Brandbank = NutritionBrandbank | ProducerBrandbank | IngredientsBrandbank

interface BrandbankLayout {
  sectionId: number
  sectionName: string
  fields: {
    fieldId: number
    fieldName: string
  }[]
}

export interface NutritionBrandbank extends BrandbankLayout {
  sectionId: 2
  sectionName: 'Wartości odżywcze'
  fields: MacroField[]
}

export interface MacroField {
  fieldId: 85
  fieldName: 'Wartości odżywcze'
  content: {
    Headings: string[]
    Nutrients: {
      Name: NutritionName
      Values: string[]
    }[]
  }
}

interface ProducerBrandbank extends BrandbankLayout {
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

interface IngredientsBrandbank extends BrandbankLayout {
  sectionId: 1
  sectionName: 'Składniki'
  fields: ({
    fieldId: 178
    fieldName: 'Spis składników odżywczych na przodzie opakowania'
    contentType: 'FrontOfPackGDA'
    content: {
      Reference: 'Na porcję'
      Headers: string[]
      'Wartość energetyczna': {
        /** 2,3 kJ */
        Quantity: string
        /** '0.00' */
        Percentage: string
        Rating: null | string
      }
      Footers: string[]
    }[]
  } | {
    fieldId: 84
    fieldName: 'Składniki'
    contentType: 'LongTextItems'
    content: string[]
  })[]
}

type NutritionName =
  | 'Energia'
  | 'Tłuszcz '
  | ' w tym kwasy nasycone '
  | 'Węglowodany '
  | ' w tym cukry '
  | 'Białko '
  
export interface FriscoProductId extends String {}