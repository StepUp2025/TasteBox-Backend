import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber({}, { message: 'page는 숫자여야 합니다.' })
  @Min(1, { message: 'page는 1 이상이어야 합니다' })
  @Type(() => Number)
  page?: number;
}
