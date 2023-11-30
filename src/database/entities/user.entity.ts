import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../../common/enums';
import { Exclude } from 'class-transformer';
import { hashUtils } from '../../utils/hashUtils.util';
import { ApiHideProperty } from '@nestjs/swagger';

@Index(['googleId', 'email'])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  passwordHash: string;

  @Column('jsonb', { default: [UserRoles.user] })
  roles: string[];

  @Column({ unique: true, nullable: true })
  phone: string;

  @CreateDateColumn()
  created_at: number;

  @UpdateDateColumn()
  updated_at: number;

  @BeforeInsert()
  async hashPassword() {
    this.passwordHash = await hashUtils.hashData(this.passwordHash);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setRoles() {
    console.log('HOOK CALLED');
    if (!this.middleName || !this.phone) {
      this.roles = [UserRoles.uncompleted];
    } else if (this.middleName && this.phone) {
      this.roles = [UserRoles.user];
    }
  }
}
