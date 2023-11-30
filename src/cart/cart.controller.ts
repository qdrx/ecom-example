import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthentificatedGuard } from '../auth/guards';
import { Request } from 'express';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@UseGuards(AuthentificatedGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    return this.cartService.getCart(req.user['id']);
  }

  @Post()
  async addToCart(@Req() req: Request, @Body() dto: AddToCartDto) {
    return this.cartService.add(req.user['id'], dto);
  }

  @Patch()
  async changeQuantity(@Req() req: Request, @Body() dto: AddToCartDto) {
    return this.cartService.updateCount(req.user['id'], dto);
  }

  @Delete()
  async removeFromCart(@Req() req: Request, @Body() dto: RemoveFromCartDto) {
    return this.cartService.removeItem(req.user['id'], dto);
  }
}
