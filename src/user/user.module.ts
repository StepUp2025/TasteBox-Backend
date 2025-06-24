import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserValidator } from './user.validator';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserValidator],
  exports: [UserService, UserRepository],
})
export class UserModule {}
