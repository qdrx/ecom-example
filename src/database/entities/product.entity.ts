import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from './product-type.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => ProductType, (type) => type.products, { cascade: true })
  type: ProductType[];

  @Column()
  description: string;

  @Column()
  characteristics: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  in_stock: number;

  @Column()
  images: string;
}
