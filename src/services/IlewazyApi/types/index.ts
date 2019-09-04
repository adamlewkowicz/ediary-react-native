import { PortionType, BarcodeId, ProductUnit } from '../../../types';
import { FriscoProductId } from '../../FriscoApi/types';

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

export interface NormalizedProduct {
  _id: string | number | FriscoProductId
  name: string
  portion?: number | null
  prots: number
  carbs: number
  fats: number
  kcal: number
  portions: {
    type: PortionType
    unit: ProductUnit
    value: number
  }[]
  unit?: ProductUnit | null
  images?: string[]
  barcode?: BarcodeId
  producer?: string
  description?: string
  ingredients?: string[]
}