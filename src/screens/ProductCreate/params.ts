import { Product } from '../../database/entities';
import { BarcodeId } from '../../types';

export interface ProductCreateParams {
  barcode?: BarcodeId
  name?: string
  onProductCreated?: (product: Product) => void
  /** Internal param for navigation options. */
  _handleProductCreate?: () => void
}