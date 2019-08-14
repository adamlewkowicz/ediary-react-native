import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class UnitType {
  /** g, mg, kg, ml... */
  @PrimaryColumn()
  value!: string;
}

@Entity()
export class PortionType {
  /** spoon, glass, handful... */
  @PrimaryColumn()
  value!: string;
}