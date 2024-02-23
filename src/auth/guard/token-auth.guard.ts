import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';
import { UserService } from '../../user/user.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (isPublic) {
      req.isRoutePublic = true;

      return true;
    }

    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException();
    }
    const token = this.authService.extractTokenFromHeader(rawToken);

    const result = await this.authService.verifyToken(token);

    const user = await this.usersService.findUserByEmail(result.email);

    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends TokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isRoutePublic) {
      return true;
    }
    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('NOT_ACCESS_TOKEN');
    }
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends TokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isRoutePublic) {
      return true;
    }
    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('NOT_REFRESH_TOKEN');
    }

    return true;
  }
}
