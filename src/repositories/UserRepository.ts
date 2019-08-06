import { GenericRepository } from './Generic';
import { EntityRepository, DeepPartial } from 'typeorm/browser';
import { User, Profile } from '../entities';
import { UserId } from '../types';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

  async createProfile(
    userId: UserId,
    payload: DeepPartial<Profile>
  ): Promise<Profile> {
    const profileInstance = Object.assign(new Profile(), { ...payload, userId });

    const profile = await this.manager
      .getRepository(Profile)
      .save(profileInstance);

    return profile;
  }

}