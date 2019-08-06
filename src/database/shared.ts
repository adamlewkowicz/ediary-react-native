import { Column } from 'typeorm/browser';

export class Macro {
  
  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  carbs!: number;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  prots!: number;
  
  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  fats!: number;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  kcal!: number;

}