import {
  Repository,
  FindOneOptions,
  DeepPartial,
  ObjectType,
} from 'typeorm/browser';

export class GenericRepository<T> extends Repository<T> {

  findOneOrSave<P extends DeepPartial<T>>(
    options: FindOneOptions,
    payload: P
  ): Promise<T> {
    return this.manager.transaction(async manager => {
      const entity: ObjectType<T> = this.target as any;
      const existingItem = await manager.findOne(entity, options);
      if (existingItem) {
        return existingItem;
      }
      const createdItem = await manager.save(entity, payload);
      return createdItem;
    });
  }

}