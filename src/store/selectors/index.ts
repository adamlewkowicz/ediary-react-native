import { AppState } from '..';
import { Product } from '../../entities';

export const mealsMergedSelector = (
  meals: AppState['diary']['meals'],
  products: AppState['diary']['products']
) => (
  meals.map(meal => ({
    ...meal,
    products: meal.products.map(productId => 
      products.find(product => product.id === productId) as Product
    )
  }))
);