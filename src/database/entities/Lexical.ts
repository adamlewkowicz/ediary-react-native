import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class PortionType {
  @PrimaryColumn()
  value!: string;
}

export { PortionType as UnitType };