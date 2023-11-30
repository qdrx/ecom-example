import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductType } from '../../entities/product-type.entity';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductType)
    private typeRepository: Repository<ProductType>,
  ) {}

  async run() {
    const generatedTypes = new Array(5).fill(null).map(() => {
      const type = new ProductType();
      type.name = faker.commerce.department();
      return type;
    });

    await this.typeRepository.save(generatedTypes);

    const generatedProducts: Promise<Product>[] = new Array(150)
      .fill(null)
      .map(async () => {
        const typesCount = await this.typeRepository.count();
        const randomTypeIndex = Math.floor(Math.random() * typesCount);
        const selectedType = await this.typeRepository.findOne({
          where: { id: randomTypeIndex },
        });

        const product = new Product();
        product.name = faker.commerce.productName();
        product.price = faker.number.int({ min: 5, max: 5000 });
        product.in_stock = faker.number.int({ min: 5, max: 5000 });
        product.images = JSON.stringify([
          faker.image.url(),
          faker.image.url(),
          faker.image.url(),
        ]);
        product.description = faker.commerce.productDescription();
        product.characteristics = faker.commerce.productMaterial();
        product.type = [selectedType];
        return product;
      });
    const products = await Promise.all(generatedProducts);

    await this.productRepository.save(products);
  }
}
