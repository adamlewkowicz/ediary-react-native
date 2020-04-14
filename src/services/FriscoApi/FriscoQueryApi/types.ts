import { BarcodeId } from '../../../types';
import { FriscoProductId } from '../types/common';

export interface FriscoQueryResponse {
  products: FriscoQueryResponseProduct[]
}

export interface FriscoQueryResponseProduct {
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
      substances?: ProductSubstance[]
    }
  }
}

export interface ProductSubstance {
  name: QuerySubstanceName
  quantity: number
  quantityInUnit: number
}

type QuerySubstanceName = 'białko' | 'węglowodany' | 'tłuszcz' | 'błonnik' | 'sód'