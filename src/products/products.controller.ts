import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../common/enums';
import { AuthentificatedGuard } from '../auth/guards';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthentificatedGuard)
  @Roles([UserRoles.admin, UserRoles.developer])
  async addProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @Get()
  async getProducts(@Query() paginationQuery: PaginationQueryDto) {
    return await this.productService.findAll(paginationQuery);
  }
}
