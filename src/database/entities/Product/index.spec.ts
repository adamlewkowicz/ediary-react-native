import { Product } from '.'
import { MealProduct } from '../MealProduct';
import { Meal } from '../Meal';

test('Product.findMostUsed', async () => {
  const product = await Product.save({ name: 'Cucumber' });
  const product2 = await Product.save({ name: 'Cucumber 2' });
  const meal = await Meal.save({ name: 'Cucumber soup' });
  const meal2 = await Meal.save({ name: 'Cucumber soup 2' });

  await MealProduct.save({
    mealId: meal.id,
    productId: product.id,
    quantity: 150
  });
  await MealProduct.save({
    mealId: meal2.id,
    productId: product.id,
    quantity: 150
  });
  await MealProduct.save({
    mealId: meal.id,
    productId: product2.id,
    quantity: 150
  });

  const [firstProduct, secondProduct] = await Product.findMostUsed();

  expect(firstProduct.productId).toBe(product.id);
  expect(firstProduct.count).toBe(2);
  expect(secondProduct.productId).toBe(product2.id);
  expect(secondProduct.count).toBe(1);
});