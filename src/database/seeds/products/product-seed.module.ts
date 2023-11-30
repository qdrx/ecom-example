import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSeedService } from './product-seed.service';
import { Product } from '../../entities';
import { ProductType } from '../../entities/product-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductType])],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
