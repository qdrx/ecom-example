import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../database/entities';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { CartProduct } from '../database/entities/cart-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    ProductsModule,
    UsersModule,
  ],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
