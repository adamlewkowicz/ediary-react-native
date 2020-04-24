import { Macro } from './Macro';
import { Column } from 'typeorm';

export abstract class MacroDetailed extends Macro {

  // @TODO make nullable
  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  fattyAcids?: number;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    default: 0
  })
  sugars?: number;

}