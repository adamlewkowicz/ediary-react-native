import {
  Repository,
  FindOneOptions,
  DeepPartial,
} from 'typeorm/browser';

export class GenericRepository<T> extends Repository<T> {

  async findOneOrSave<P extends DeepPartial<T>>(
    options: FindOneOptions,
    payload: P
  ): Promise<T> {
    const existingItem = await this.findOne(options);
    if (existingItem) {
      return existingItem;
    }
    const createdItem = await this.save(payload);
    return createdItem;
  }

}