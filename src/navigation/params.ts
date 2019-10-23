import { BarcodeScanParams } from '../screens/BarcodeScan/params';
import { ProductFindParams } from '../screens/ProductFind/params';
import { ProductCreateParams } from '../screens/ProductCreate/params';

export type ScreenParamsMap = {
  ProductFind: ProductFindParams
  ProductCreate: ProductCreateParams
  BarcodeScan: BarcodeScanParams
  Home: undefined
  Main: undefined
  DiarySummary: undefined
  ProfileCreate: undefined
}