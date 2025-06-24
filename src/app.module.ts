import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CollectionModule } from './collection/collection.module';
import { CollectionContentsModule } from './collection-contents/collection-contents.module';
import { GenreModule } from './genre/genre.module';
import { PreferenceModule } from './preference/preference.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MovieModule,
    CollectionModule,
    CollectionContentsModule,
    GenreModule,
    PreferenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
