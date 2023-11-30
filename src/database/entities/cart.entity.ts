import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['userId', 'purchaseId'])
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  purchaseId: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  image: string;

  @Column()
  count: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
}
