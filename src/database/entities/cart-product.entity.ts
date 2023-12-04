import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Cart } from './cart.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.products)
    cart: Cart;

    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product;

    @Column()
    quantity: number;
}
