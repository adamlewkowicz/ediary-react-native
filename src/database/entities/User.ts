import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  getRepository,
} from 'typeorm';
import {
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserId } from '../../types';
import { Product } from './Product';
import { Meal } from './Meal';
import { Profile } from './Profile';
import { GenericEntity } from '../generics/GenericEntity';
import { DeepPartial } from 'redux';
import { EntityType } from '../types';
import { ProductFavorite } from './ProductFavorite';

@Entity('user')
export class User extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: UserId;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsEmail()
  email!: string | null;

  @Column()
  login!: string;

  @Column()
  @MinLength(4)
  @MaxLength(14)
  password!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;

  @OneToMany(
    type => Product,
    product => product.userId
  )
  products?: Product[];
  
  @OneToMany(
    type => Meal,
    meal => meal.userId
  )
  meals?: Meal[];

  @OneToOne(
    type => Profile,
    profile => profile.user
  )
  profile?: Profile; 

  @OneToMany(
    type => ProductFavorite,
    productFavorite => productFavorite.user,
    { onDelete: 'CASCADE' }
  )
  productFavorites?: ProductFavorite[];
  
  async getProfile(): Promise<Profile> {
    const profile = await getRepository(Profile).findOneOrFail(this.id);
    this.profile = profile;
    return profile;
  }

  static async getOrCreate(
    payload: DeepPartial<IUser> & { id: UserId }
  ): Promise<User> {
    const { id } = await this.findOneOrSave({
      where: { id: payload.id }},
      payload
    );

    const user = await this
      .findOneOrFail({
        where: { id },
        relations: ['profile']
      });

    return user;
  }

  static async createProfile(
    userId: UserId,
    profile: DeepPartial<Profile>
  ): Promise<Profile> {
    return Profile.save({ 
      ...profile,
      userId
    });
  }
}

export type IUser = EntityType<User>;