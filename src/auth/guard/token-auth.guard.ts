import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { IsPublicEnum } from '../../common/decorator/is-public.const';
import { ISPUBLIC_KEY } from '../../common/decorator/is-public.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPublic = this.reflector.getAllAndOverride(ISPUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (requiredPublic) {
      req.requiredPublic = requiredPublic;
    }

    if (requiredPublic === IsPublicEnum.ISPUBLIC) {
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

    if (
      req.requiredPublic === IsPublicEnum.ISPUBLIC ||
      IsPublicEnum.ISREFRESHTOKEN
    ) {
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
