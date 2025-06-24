import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'ko-KR';

const TMDB_AUTH_HEADER = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  accept: 'application/json',
};

export function buildTmdbUrl(
  path: string,
  query: Record<string, string | number> = {},
): string {
  const processedQuery: Record<string, string> = {};
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      processedQuery[key] = String(query[key]);
    }
  }

  processedQuery['language'] = processedQuery['language'] || DEFAULT_LANGUAGE;

  const queryString = new URLSearchParams(processedQuery).toString();
  return `${TMDB_BASE_URL}${path}${queryString ? '?' + queryString : ''}`;
}

export async function fetchFromTmdb<T>(
  httpService: HttpService,
  url: string,
): Promise<T> {
  const response = await firstValueFrom(
    httpService.get<T>(url, {
      headers: TMDB_AUTH_HEADER,
    }),
  );
  return response.data;
}
