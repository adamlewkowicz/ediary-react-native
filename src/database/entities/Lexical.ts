import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

/**
 * @deprecated - for now at least
 */
@Entity('unit_type')
export class UnitType {
  /** g, mg, kg, ml... */
  @PrimaryColumn()
  value!: string;
}

/**
 * @deprecated - for now at least
 */
@Entity('portion_type')
export class PortionType {
  /** spoon, glass, handful... */
  @PrimaryColumn()
  value!: string;
}