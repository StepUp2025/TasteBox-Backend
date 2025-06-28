import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import type { UserRepository } from 'src/user/user.repository';

@Injectable()
export class LocalUserOnlyGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user.id;

    const user = await this.userRepository.findOneById(userId);
    if (!user) return false;

    return user.provider === AuthProvider.LOCAL;
  }
}
