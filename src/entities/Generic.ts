import {
  BaseEntity,
  FindOneOptions,
  DeepPartial,
  getConnection,
  ObjectType,
} from 'typeorm/browser';

export class GenericEntity extends BaseEntity {

  static async findOneOrSave<T extends BaseEntity>(
    this: ObjectType<T>,
    options: FindOneOptions,
    payload: DeepPartial<T>
  ): Promise<T> {
    return getConnection('transactional').transaction(async manager => {
      const Entity: ObjectType<T> = super.target as any;
      const existingItem = await manager.findOne(Entity, options);
      if (existingItem) {
        return existingItem;
      }
      const createdItem = await manager.save(Entity, payload);
      return createdItem;
    });
  }

}