import { PartialType } from '@nestjs/swagger';
import { CreateCollectionRequestDto } from './create-collection-request.dto';

export class UpdateCollectionRequestDto extends PartialType(
  CreateCollectionRequestDto,
) {}
