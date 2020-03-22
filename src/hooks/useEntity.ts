import { useState } from 'react'
import { Product, Meal, IProductRequired } from '../database/entities'
import { BaseEntity } from 'typeorm';
import { GenericEntity } from '../database/generics/GenericEntity';

// 
// Prefer
// - instanceless (serializable) entities

export const useEntity = <T extends GenericEntity>(Entity: T) => {
  const [entityInstance, setEntityInstance] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInstantiated, setIsInstantiated] = useState(false);
  
  const create = async () => {
    setIsLoading(true);
    const prod = await Entity.save({});
    setEntityInstance(prod);
    setIsLoading(false);
  }

  const findById = async (id: any) => {
    setIsLoading(true);
    const [result] = await Product.findByIds(id);
    // const prod = await Entity.({});
    setEntityInstance((result ?? null) as any);
    setIsLoading(false);
  }

  const remove = () => entityInstance?.remove();

  const update = async (payload: Partial<Product>) => {
    setEntityInstance(ent => ({ ...ent, ...payload }) as any);
    await Product.update(1, payload);
  }
  
  return {
    entity: entityInstance,
    isLoading,
    findById,
    remove,
    update,
  }
}

const useProduct = () => {
  const product = useEntity(new Product as any);

  product.findById(41);

  product.remove();

  product.update({ barcode: '13131' });
}