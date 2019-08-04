import { EntityRepository, Repository, Like } from 'typeorm/browser';
import { Product, ProductPortion } from '../entities';
import { ProductFinder, productFinder } from '../services/ProductFinder';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

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

        const createdProducts = await this.save(verifiedProducts);
        
        return [...savedProducts, ...createdProducts];
      }
    }

    return savedProducts;
  }
}