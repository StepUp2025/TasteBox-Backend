import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CollectionModule } from './collection/collection.module';
import { CollectionContentsModule } from './collection-contents/collection-contents.module';
import { GenreModule } from './genre/genre.module';
import { PreferenceModule } from './preference/preference.module';

@Module({
  imports: [AuthModule, UserModule, CollectionModule, CollectionContentsModule, GenreModule, PreferenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
