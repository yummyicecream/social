import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TokenDto } from './dto/token.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async userLogin(dto: LoginDto): Promise<TokenDto> {
    const { email, password } = dto;
    const signedInUser = await this.userService.findUserByEmail(email);
    // 저장되어있는 해쉬된 비밀번호와 생비밀번호 compare
    const checkIfMatches = await bcrypt.compare(
      password,
      signedInUser.password,
    );
    if (!checkIfMatches) {
      throw new UnauthorizedException();
    }

    const accessToken = this.generateAccessToken(signedInUser);
    const refreshToken = this.generateRefreshToken(signedInUser);
    await this.cacheManager.set(signedInUser.email, refreshToken);

    await this.cacheManager.get(signedInUser.email);
    return new TokenDto(accessToken, refreshToken);
  }

  public generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        type: 'access',
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: '1day',
      },
    );
  }
  public generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        type: 'refresh',
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: '7day',
      },
    );
  }
  public extractTokenFromHeader(rawToken: string): string | undefined {
    const [type, token] = rawToken?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async reissueAccessToken(user: User, token: string): Promise<TokenDto> {
    const { email } = user;

    const savedRefreshtoken: string = await this.cacheManager.get(email);
    if (token !== savedRefreshtoken) {
      throw new UnauthorizedException();
    }
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    this.cacheManager.del(email);
    this.cacheManager.set(email, newRefreshToken);

    return new TokenDto(newAccessToken, newRefreshToken);
  }
}
