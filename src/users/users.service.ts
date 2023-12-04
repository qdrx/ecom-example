import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { Cart, User } from '../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceException } from '../common/exceptions';
import { hashUtils } from '../utils/hashUtils.util';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
    });
    if (existingUser) {
      throw new ServiceException(
          'User with such email or phone already exists',
          400,
      );
    }
    createUserDto['passwordHash'] = createUserDto.password;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // const candidate = this.userRepository.create(createUserDto);
    try {
      const candidate = plainToClass(User, createUserDto);
      candidate.cart = new Cart();
      await queryRunner.manager.save(candidate);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  async createGoogleUser(createUserDto: CreateGoogleUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
    });
    console.log(createUserDto);
    if (existingUser) {
      throw new ServiceException(
          'User with such email or phone already exists',
          400,
      );
    }
    const passwordHash = await hashUtils.hashData(createUserDto.password);
    const candidate = this.userRepository.create({
      passwordHash: passwordHash,
      ...createUserDto,
    });
    return await this.userRepository.save(candidate);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneByIdCart(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['cart.products.product'],
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }
    const updateFields: Partial<CreateUserDto> = { ...updateUserDto };

    for (const key in updateUserDto) {
      if (updateUserDto.hasOwnProperty(key)) {
        if (key !== 'password') {
          existingUser[key] = updateUserDto[key];
        }
      }
    }

    if (updateFields.password) {
      updateFields.password = await hashUtils.hashData(updateFields.password);
    }

    await this.userRepository.save(existingUser);

    return await this.userRepository.findOne({ where: { id } });
  }
}
