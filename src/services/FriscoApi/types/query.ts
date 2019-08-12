import { MacroElement, BarcodeId } from '../../../types';
import { FriscoProductId } from './common';

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