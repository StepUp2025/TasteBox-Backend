import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        dropSchema: configService.getOrThrow<string>('DROP_SCHEMA') === 'true',
        synchronize: configService.getOrThrow<string>('SYNCHRONIZE') === 'true',
        logging: configService.getOrThrow<string>('LOGGING') === 'true',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
