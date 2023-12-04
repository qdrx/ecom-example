import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartProduct } from './cart-product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  id: number;

  @OneToMany(() => CartProduct, (cartProducts) => cartProducts.cart, {
    nullable: true,
  })
  products: CartProduct[];
}
