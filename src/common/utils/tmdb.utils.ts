import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ExternalApiException } from '../exceptions/external-api-exception';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'ko-KR';

export function buildTmdbUrl(
  path: string,
  query: Record<string, string | number> = {},
): string {
  const processedQuery: Record<string, string> = {};
  for (const key in query) {
    if (Object.hasOwn(query, key)) {
      processedQuery[key] = String(query[key]);
    }
  }

  processedQuery.language = processedQuery.language || DEFAULT_LANGUAGE;

  const queryString = new URLSearchParams(processedQuery).toString();
  return `${TMDB_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
}

export async function fetchFromTmdb<T>(
  httpService: HttpService,
  url: string,
  configService: ConfigService,
): Promise<T> {
  const token = configService.get<string>('TMDB_ACCESS_TOKEN');
  if (!token) {
    throw new Error('TMDB_ACCESS_TOKEN not found in environment variables');
  }

  try {
    const response = await firstValueFrom(
      httpService.get<T>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      }),
    );
    return response.data;
  } catch (_error) {
    throw new ExternalApiException();
  }
}
