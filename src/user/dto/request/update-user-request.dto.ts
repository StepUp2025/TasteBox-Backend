import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user-request.dto';

export class UpdateUserProfileRequestDto extends PartialType(
  PickType(CreateUserRequestDto, ['nickname', 'contact', 'image'] as const),
) {}
