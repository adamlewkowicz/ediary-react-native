import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('unit_type')
export class UnitType {
  /** g, mg, kg, ml... */
  @PrimaryColumn()
  value!: string;
}

@Entity('portion_type')
export class PortionType {
  /** spoon, glass, handful... */
  @PrimaryColumn()
  value!: string;
}