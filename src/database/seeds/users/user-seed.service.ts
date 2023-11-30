import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { hashUtils } from '../../../utils/hashUtils.util';
import { UserRoles } from '../../../common/enums';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const hashedPassword = await hashUtils.hashData(faker.internet.password());
    const generatedUsers: User[] = new Array(10).fill(null).map(() => {
      const user = new User();
      user.email = faker.internet.email();
      user.passwordHash = hashedPassword;
      user.name = faker.person.firstName();
      user.surname = faker.person.lastName();
      user.phone = faker.phone.number();
      user.middleName = faker.person.middleName();
      return user;
    });
    console.log(generatedUsers);
    await this.repository.save(generatedUsers);

    const admin = new User();
    admin.email = faker.internet.email();
    admin.passwordHash = await hashUtils.hashData('ADMIN');
    admin.name = faker.person.firstName();
    admin.surname = faker.person.lastName();
    admin.phone = faker.phone.number();
    admin.middleName = faker.person.middleName();
    admin.roles = [UserRoles.admin, UserRoles.developer];
    await this.repository.save(admin);
  }
}
