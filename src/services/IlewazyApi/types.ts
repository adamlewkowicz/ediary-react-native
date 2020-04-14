import { ProductPortionType } from '../../types';

export interface Response {
  page: null
  records: string
  total: number
  data?: ProductItem[]
}

export interface ProductItem {
  /** Product name */
  ingredient_name: string
  weglowodany: string
  simple_sugars?: null | string
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
    [key in PortionType | string]?: UnitData
  }
}

export type PortionType = 'szklanka' | 'porcja' | 'sztuka' | 'kromka' | 'lyzka' | 'garsc';

export type UnitData = {
  filename: string
  id: string
  id_iu: string
  /** "porcja-koncentratu-zupy-grzybowej" */
  post_name: string
  /** "Porcja" */
  unit_name: string
  /** "300" */
  unit_weight?: string
}

export type KnownPortionMap = {
  [key in PortionType]: ProductPortionType
}