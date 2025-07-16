import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/common/aws/s3.module';
import { Content } from 'src/content/entities/content.entity';
import { UserModule } from 'src/user/user.module';
import { CollectionController } from './collection.controller';
import { CollectionRepository } from './collection.repository';
import { CollectionService } from './collection.service';
import { CollectionContentRepository } from './collection-content.repository';
import { Collection } from './entities/collection.entity';
import { CollectionContent } from './entities/collection-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, CollectionContent, Content]),
    UserModule,
    S3Module,
  ],
  controllers: [CollectionController],
  providers: [
    CollectionService,
    CollectionRepository,
    CollectionContentRepository,
  ],
  exports: [CollectionContentRepository],
})
export class CollectionModule {}
