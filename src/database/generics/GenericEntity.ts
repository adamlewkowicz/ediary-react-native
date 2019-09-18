import {
  BaseEntity,
  FindOneOptions,
  DeepPartial,
  ObjectType,
  SaveOptions,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { validate } from 'class-validator';
import { EntityValidationError } from '../../common/error';

export abstract class GenericEntity extends BaseEntity {

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

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const [error] = await validate(this);
    if (error) {
      const [firstErrorMessage] = Object.values(error.constraints);
      throw new EntityValidationError(firstErrorMessage);
    }
  }

}