import {
  BaseEntity,
  FindOneOptions,
  DeepPartial,
  getConnection,
  ObjectType,
  SaveOptions,
} from 'typeorm';

export class GenericEntity extends BaseEntity {

  static async findOneOrSaveTrx<T extends BaseEntity>(
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

  static async findOneOrSave<T extends BaseEntity>(
    this: ObjectType<T>,
    options: FindOneOptions,
    payload: DeepPartial<T>
  ): Promise<T> {
    const existingItem = await super.findOne(options);
    if (existingItem) {
      return existingItem;
    }
    const createdItem: T = await (this as typeof GenericEntity).save<T>(payload);
    return createdItem;
  }

  static save<T extends BaseEntity>(
    this: ObjectType<T>,
    entityOrEntities: DeepPartial<T> | DeepPartial<T>[],
    saveOptions?: SaveOptions
  ): Promise<T> {
    const entityInstances = super.create(entityOrEntities as any);
    return super.save(entityInstances as any, saveOptions);
  }

}