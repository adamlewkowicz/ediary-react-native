import { Product } from '../../database/entities';
import { NormalizedProduct } from '../../services/IlewazyApi/types';

export type FoundProductType = 'saved' | 'fetched';

export type FoundProducts = (
  {
    type: 'saved'
    data: Product
  } | 
  {
    type: 'fetched'
    data: NormalizedProduct
  }
)[];