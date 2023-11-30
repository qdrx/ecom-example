import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities';
import { ProductsController } from './products.controller';
import { ProductType } from '../database/entities/product-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductType])],
  providers: [ProductService],
  controllers: [ProductsController],
  exports: [ProductService],
})
export class ProductsModule {}
