import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { BarcodeId } from '../../types';

export interface ProductCreateParams {
  barcode?: BarcodeId
  name?: string
  onProductCreated?: (product: Product) => void
  onProductEdited?: (product: Product) => void
  /** Internal param for navigation options. */
  _handleProductCreate?: () => void
  productToEdit?: ProductOrNormalizedProduct
  operationType?: 'edit' | 'create'
}