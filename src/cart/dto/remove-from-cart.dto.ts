import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFromCartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
