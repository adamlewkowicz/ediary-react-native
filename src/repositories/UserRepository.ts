import { GenericRepository } from './Generic';
import { EntityRepository } from 'typeorm/browser';
import { User } from '../entities';

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {}