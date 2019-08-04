import { EntityRepository, Like } from 'typeorm/browser';
import { Product, ProductPortion } from '../entities';
import { ProductFinder, productFinder } from '../services/ProductFinder';
import { GenericRepository } from './Generic';

@EntityRepository(Product)
export class ProductRepository extends GenericRepository<Product> {

  productFinder: ProductFinder;

  constructor() {
    super();
    this.productFinder = productFinder;
  }
  
  async findByNameLike(name: string, limit: number = 10): Promise<Product[]> {
    const results = this.find({
      where: { name: Like(`%${name}%`) },
      take: limit
    });

    return results;
  }

  async findAndFetchByNameLike(name: string): Promise<Product[]> {
    const savedProducts = await this.findByNameLike(name);

    if (savedProducts.length <= 3) {
      const foundProducts = await this.productFinder.findByName(name);

      if (foundProducts.length) {
        const verifiedProducts = foundProducts.map(product => ({
          ...product,
          verified: true,
          portions: product.portions.map(portion => {
            const productPortion = new ProductPortion;
            productPortion.type = portion.type;
            productPortion.value = portion.value;
            return productPortion;
          }),
        }));

        const foundOrCreatedProducts = await Promise.all(
          verifiedProducts.map(product =>
            this.findOneOrSave({
              where: {
                name: product.name,
                verified: true
              }
            }, product)
          )
        );
        
        return [...savedProducts, ...foundOrCreatedProducts];
      }
    }

    return savedProducts;
  }
}