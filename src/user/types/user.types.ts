import { AuthProvider } from '../enums/auth-provider.enum';

export type EmailDuplicateResult =
  | { isDuplicate: false }
  | { isDuplicate: true; provider: AuthProvider };
