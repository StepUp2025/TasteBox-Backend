import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import { MovieListResponseDto } from 'src/content/movie/dto/movie-list-response.dto';
import { TvSeriesListResponseDto } from 'src/content/tv-series/dto/tv-series-list-response.dto';

export function validatePageAndCreateListDto<
  T,
  ListResponseDtoType extends MovieListResponseDto | TvSeriesListResponseDto,
>(
  DtoConstructor: new (params: {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
  }) => ListResponseDtoType,
  page: number,
  limit: number,
  results: T[],
  totalCount: number,
): ListResponseDtoType {
  const totalPages = Math.ceil(totalCount / limit);

  if (page > totalPages && results.length === 0 && totalCount > 0) {
    throw new InvalidPageException();
  }

  return new DtoConstructor({
    results,
    page,
    limit,
    totalPages,
  });
}
