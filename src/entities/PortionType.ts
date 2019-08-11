import {
  Entity,
  PrimaryColumn,
} from 'typeorm/browser';

@Entity()
export class PortionType {

  @PrimaryColumn()
  value!: string;

}