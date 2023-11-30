import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  in_stock: number;

  @IsArray()
  images: string[];

  @IsArray()
  type: string[];

  @IsString()
  description: string;

  @IsString()
  characteristics: string;
}
