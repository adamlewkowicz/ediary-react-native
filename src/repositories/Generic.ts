import {
  Repository,
  FindOneOptions,
  DeepPartial,
  ObjectType,
  ObjectID,
  getConnection,
} from 'typeorm/browser';

export class GenericRepository<T> extends Repository<T> {

  // does not allow to execute another query in the same time
  // does not return entity instance - debug
  findOneOrSave<P extends DeepPartial<T>>(
    options: FindOneOptions,
    payload: P
  ): Promise<T> {
    return getConnection('transactional').transaction(async manager => {
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

type TypeOrmFindId = string | number | Date | ObjectID;