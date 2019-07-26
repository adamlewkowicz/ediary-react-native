import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm/browser';

@Entity('Product')
export class Product {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

}