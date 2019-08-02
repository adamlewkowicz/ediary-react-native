import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import { UserId } from '../types';

@Entity('User')
export class User {

  @PrimaryGeneratedColumn()
  id!: UserId;

  @Column()
  email!: string;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;
  
}