import { EntityRepository, Repository } from 'typeorm/browser';
import { Meal, Product } from '../entities';
import { productRepository, mealProductRepository } from './index';

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {

  async addProduct(
    mealId: Meal['id'],
    productOrProductId: Product | Product['id']
  ) {
    const productAction = typeof productOrProductId === 'number'
      ? productRepository.findOne(productOrProductId)
      : productRepository.save(productOrProductId);

    const product = await productAction;

    if (!product) {
      throw new Error(
        'Product couldnt be found or created'
      );
    }

    const mealProduct = await mealProductRepository.save({
      productId: product.id,
      mealId
    });

    return { ...product, ...mealProduct };
  }
}