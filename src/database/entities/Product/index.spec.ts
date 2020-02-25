import { Product } from '.'
import { Meal } from '../Meal';
import { NormalizedProduct } from '../../../services/IlewazyApi/types';

describe('Product', () => {

  describe('findMostUsed()' ,() => {
    it('should find most used products', async () => {
      const productMock = await Product.save({ name: 'Cucumber' });
      await Meal.createWithProductId({ name: 'Cucumber soup' }, productMock.id);

      const [foundProduct] = await Product.findMostUsed();
    
      expect(foundProduct.productId).toEqual(productMock.id);
      expect(foundProduct.count).toEqual(1);
    });
  });

  describe('findRecentlyUsed()', () => {
    it('should find recently used products', async () => {
      const productMock = await Product.save({ name: 'Cucumber' });
      await Meal.createWithProductId({ name: 'Cucumber soup' }, productMock.id);

      const [foundProduct] = await Product.findRecentlyUsed();
    
      expect(foundProduct.id).toEqual(productMock.id);
    });
  });

  describe('saveNormalizedProduct()', () => {
    it('should properly save normalized product', async () => {
      const normalizedProduct: NormalizedProduct = {
        _id: 1,
        name: 'Abc',
        macro: {
          carbs: 10,
          prots: 10,
          fats: 10,
          kcal: 10,
        },
        portion: 100,
        portions: [],
      }
      const savedProduct = await Product.saveNormalizedProduct(normalizedProduct);

      expect(savedProduct).toBeInstanceOf(Product);
    });
  });
  
});