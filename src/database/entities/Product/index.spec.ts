import { Product } from '.'
import { MealProduct } from '../MealProduct';
import { Meal } from '../Meal';
import { NormalizedProduct } from '../../../services/IlewazyApi/types';

describe('Product', () => {

  describe('findMostUsed()' ,() => {
    it('should return most used products sorted descendingly ', async () => {
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
  });

  describe('findRecentlyUsed()', () => {
    it('should return recently used products sorted by meal id', async () => {
      const product = await Product.save({ name: 'Cucumber' });
      const product2 = await Product.save({ name: 'Cucumber 2' });
      const meal = await Meal.save({ name: 'Cucumber soup' });
      
      await MealProduct.save({
        mealId: meal.id,
        productId: product.id,
        quantity: 120
      });
      await MealProduct.save({
        mealId: meal.id,
        productId: product2.id,
        quantity: 120
      });
    
      const [firstProduct, secondProduct] = await Product.findRecentlyUsed();
    
      expect(firstProduct.id).toBe(product.id);
      expect(secondProduct.id).toBe(product2.id);
    });
  });

  describe('saveNormalizedProduct()', () => {
    it('should properly parse and save normalized product', async () => {
      const normalizedProduct: NormalizedProduct = {
        _id: 1,
        name: 'Abc',
        carbs: 0,
        prots: 0,
        fats: 0,
        kcal: 0,
        portions: [],
      }
      const result = await Product.saveNormalizedProduct(normalizedProduct);
      
      expect(result).toMatchSnapshot({
        id: expect.any(Number),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });
  
});