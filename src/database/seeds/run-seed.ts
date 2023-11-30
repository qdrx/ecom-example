import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './users/user-seed.service';
import { ProductSeedService } from './products/product-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(UserSeedService).run();
  await app.get(ProductSeedService).run();

  await app.close();
};

void runSeed();
