import { Response } from 'express';

interface SetTokenCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  sameSite: 'strict' | 'lax' | 'none';
}

export function setTokenCookie(
  res: Response,
  name: string,
  value: string,
  maxAge: number,
  options?: Partial<SetTokenCookieOptions>,
): void {
  const defaultOptions: SetTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    sameSite: 'strict',
  };

  res.cookie(name, value, {
    ...defaultOptions,
    ...options,
  });
}
