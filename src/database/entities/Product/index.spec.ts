import { Product } from '.'
import { Meal } from '../Meal';
import { NormalizedProduct } from '../../../services/IlewazyApi/types';

describe('Product', () => {

  describe('findMostUsed()' ,() => {
    it('should find most used products', async () => {
      const product = await Product.save({ name: 'Cucumber' });
      await Meal.createWithProductId({ name: 'Cucumber soup' }, product.id);

      const [foundProduct] = await Product.findMostUsed();
    
      expect(foundProduct.productId).toBe(product.id);
      expect(foundProduct.count).toBe(1);
    });
  });

  describe('findRecentlyUsed()', () => {
    it('should find recently used products', async () => {
      const product = await Product.save({ name: 'Cucumber' });
      await Meal.createWithProductId({ name: 'Cucumber soup' }, product.id);

      const [foundProduct] = await Product.findRecentlyUsed();
    
      expect(foundProduct.id).toBe(product.id);
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
      const saveSpy = jest.spyOn(Product, 'save');
      const result = await Product.saveNormalizedProduct(normalizedProduct);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result).toMatchSnapshot({
        id: expect.any(Number),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });
  
});