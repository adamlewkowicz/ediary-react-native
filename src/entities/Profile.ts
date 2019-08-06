import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm/browser';
import { Min, Max } from 'class-validator';
import { WeightGoal, ProfileId } from '../types';
import { SqliteENUM } from '../database/decorators';
import { WEIGHT_GOAL } from '../common/consts';
import { Macro } from '../database/shared';
import { User } from './User';

@Entity()
export class Profile {

  @PrimaryGeneratedColumn()
  id!: ProfileId;

  @Column('tinyint')
  @Min(30)
  @Max(255)
  weight!: number;

  @Column('tinyint')
  @Min(10)
  @Max(100)
  age!: number;

  @Column()
  male!: boolean;
  
  @Column('text')
  @SqliteENUM(WEIGHT_GOAL)
  weightGoal!: WeightGoal;

  @Column(type => Macro)
  macroNeeds!: Macro;

  @OneToOne(type => User, user => user.profile)
  @JoinColumn()
  user!: User;

}