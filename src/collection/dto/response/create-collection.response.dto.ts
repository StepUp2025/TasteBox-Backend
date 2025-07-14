import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionResponseDto {
  @ApiProperty({
    description: '생성된 컬렉션의 고유 식별자',
    example: 2,
  })
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
