import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities';
import { ProductService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UsersService } from '../users/users.service';
import { ServiceException } from '../common/exceptions';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
  ) {}

  async add(userId: number, dto: AddToCartDto) {
    const existsCart = await this.cartRepository.findOne({
      where: { userId: userId, productId: dto.productId },
    });
    if (existsCart) {
      throw new ServiceException('Product is already in cart', 400);
    }
    const cart = this.cartRepository.create();
    const user = await this.userService.findOneById(userId);
    const product = await this.productService.getProductById(dto.productId);
    if (!product) {
      throw new ServiceException(
        `Product with id ${dto.productId} does not exist`,
        400,
      );
    }

    cart.userId = user.id;
    cart.productId = product.id;
    cart.name = product.name;
    cart.price = product.price;
    cart.count = dto.qty;
    cart.image = JSON.parse(product.images)[0];
    cart.totalPrice = product.price * dto.qty;

    return await this.cartRepository.save(cart);
  }

  async getCart(userId: number) {
    return await this.cartRepository.find({ where: { userId } });
  }

  async updateCount(userId: number, dto: AddToCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { userId: userId, productId: dto.productId },
    });
    if (!cart) {
      throw new ServiceException('Cart not found', 404);
    }
    await this.cartRepository.update(
      { userId: userId, productId: dto.productId },
      { count: dto.qty, totalPrice: dto.qty * cart.price },
    );
    return await this.cartRepository.findOne({
      where: { userId: userId, productId: dto.productId },
    });
  }

  async removeItem(userId: number, dto: RemoveFromCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { userId: userId, productId: dto.productId },
    });
    if (!cart) {
      throw new ServiceException('Cart or item not found', 404);
    }
  }
}
