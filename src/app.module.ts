import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import { DatabaseModule } from './common/database/database.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ContentModule } from './content/content.module';
import { GenreModule } from './genre/genre.module';
import { PreferenceModule } from './preference/preference.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    GenreModule,
    ContentModule,
    CollectionModule,
    GenreModule,
    PreferenceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
