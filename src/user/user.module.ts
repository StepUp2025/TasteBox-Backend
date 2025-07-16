import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/common/aws/s3.module';
import { Preference } from 'src/preference/entities/preference.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Preference]), S3Module],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
