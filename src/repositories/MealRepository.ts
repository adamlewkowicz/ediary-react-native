import { EntityRepository, Repository, Between } from 'typeorm/browser';
import { Meal, Product } from '../entities';
import { mealProductRepository } from '.';
import { DateDay } from '../types';

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {

  /** Adds provided product to meal.
   *  If product with given id is alread assigned to meal with provided id,
   *  then it increases it's quantity.
   */
  async addProduct(
    mealId: Meal['id'],
    product: Product,
    quantity: number
  ) {
    const productId = product.id;

    const existingMealProduct = await mealProductRepository().findOne({
      mealId,
      productId
    });

    if (existingMealProduct) {
      existingMealProduct.quantity += quantity;
      await mealProductRepository().save(existingMealProduct);
      
      return { ...product, ...existingMealProduct };
    }
    
    const createdMealProduct = await mealProductRepository().save({
      productId: product.id,
      mealId,
      quantity
    });

    return { ...product, ...createdMealProduct }; 
  }

  findByDay(dateDay: DateDay) {
    return this.find({
      where: { date: Between(`${dateDay} 00:00:00`, `${dateDay} 23:59:59`) },
      relations: ['mealProducts', 'mealProducts.product']
    });
  }
}