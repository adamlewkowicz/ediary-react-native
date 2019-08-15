import { 
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { WeightGoal, ProfileId, UserId } from '../../types';
import { SqliteENUM } from '../decorators';
import { WEIGHT_GOAL } from '../../common/consts';
import { Macro } from '../shared';
import { User } from './User';
import { measureMacroNeeds } from '../../common/helpers';

@Entity('profile')
export class Profile {

  @PrimaryGeneratedColumn()
  id!: ProfileId;

  @Column('tinyint')
  @Min(30)
  @Max(255)
  weight!: number;

  @Column('tinyint')
  @Min(100)
  @Max(230)
  height!: number;

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

  @Column()
  userId!: UserId;

  @OneToOne(type => User, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @BeforeInsert()
  measureMacroNeeds() {
    const { weight, weightGoal } = this;
    const macroNeeds = measureMacroNeeds({ weight, weightGoal });
    this.macroNeeds = macroNeeds;
  }
}