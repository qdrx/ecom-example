import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities';
import { CreateProductDto } from './dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ProductType } from '../database/entities/product-type.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductType)
    private readonly typeRepository: Repository<ProductType>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const { images, type, ...productData } = dto;
    const types: Awaited<ProductType>[] = await Promise.all(
      type.map((name) => this.preloadTypesByName(name)),
    );
    const jsonImages = JSON.stringify(images);
    const product = this.productRepository.create({
      images: jsonImages,
      type: types,
      ...productData,
    });
    return await this.productRepository.save(product);
  }

  async getProductById(productId: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id: productId } });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.productRepository.find({
      relations: ['type'],
      skip: offset,
      take: limit,
    });
  }

  async findTypeById(id: number) {
    return await this.typeRepository.findOne({
      where: { id },
      relations: ['type'],
    });
  }

  async findAllTypes(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.typeRepository.find({
      skip: offset,
      take: limit,
    });
  }

  private async preloadTypesByName(name: string): Promise<ProductType> {
    const existingType = await this.typeRepository.findOne({ where: { name } });
    if (existingType) {
      return existingType;
    }
    return this.typeRepository.create({ name });
  }
}
