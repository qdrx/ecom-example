import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  qty: number;
}
