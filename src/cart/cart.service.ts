import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../database/entities';
import { ProductService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UsersService } from '../users/users.service';
import { CartProduct } from '../database/entities/cart-product.entity';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(
      private dataSource: DataSource,
      @InjectRepository(Cart)
      private readonly cartRepository: Repository<Cart>,
      @InjectRepository(CartProduct)
      private readonly cartProductRepository: Repository<CartProduct>,
      private readonly productService: ProductService,
      private readonly userService: UsersService,
  ) {}

  async add(userId: number, dto: AddToCartDto) {
    const user = await this.userService.findOneByIdCart(userId);
    if (!user) throw new NotFoundException();
    const cart = await this.findCartWithRelations(user.cart.id);
    const productExistsInCart = cart.products.filter(
        (p) => p.product.id === dto.productId,
    );
    if (productExistsInCart.length > 0) {
      productExistsInCart[0].quantity += dto.qty;
      await this.cartProductRepository.save(productExistsInCart[0]);
      return await this.findCartWithRelations(user.cart.id);
    }
    const product = await this.productService.getProductById(dto.productId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cartProduct = this.cartProductRepository.create({
        cart: cart[0],
        product: product,
        quantity: dto.qty,
      });
      const cartProductSaved = await queryRunner.manager.save(cartProduct);
      cart.products.push(cartProductSaved);
      await queryRunner.manager.save(cart);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return await this.findCartWithRelations(user.cart.id);
  }

  async findCartWithRelations(id: number) {
    return await this.cartRepository.findOne({
      where: { id },
      relations: ['products.product'],
    });
  }

  async getCart(userId: number) {
    const user = await this.userService.findOneByIdCart(userId);
    return user.cart;
  }

  async removeItem(userId: number, dto: RemoveFromCartDto) {
    const user = await this.userService.findOneByIdCart(userId);
    console.log(user.cart.products);
    const productExistsInCart = user.cart.products.filter(
        (p) => p.product.id === dto.productId,
    );
    if (productExistsInCart.length > 0) {
      await this.cartProductRepository.remove(productExistsInCart[0]);
      return await this.findCartWithRelations(user.cart.id);
    }
    throw new NotFoundException('Item not found in cart');
  }
}
