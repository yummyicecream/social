import {
  Body,
  Controller,
  Headers,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { RefreshTokenGuard } from './guard/token-auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GetToken, GetUser } from '../common/decorator/get-user.decorator';
import { User } from '../entity/user.entity';
import { Cache } from 'cache-manager';
import { IsPublicEnum } from '../common/decorator/is-public.const';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('/login')
  @IsPublic(IsPublicEnum.ISPUBLIC)
  async userLogin(@Body() dto: LoginDto) {
    const result = await this.authService.userLogin(dto);
    return result;
  }

  //리프레쉬 토큰을 받아서 아이디를 까고 그 아이디로 레디스에서 리프뤠시 조회함
  //리프뤠시 조회해서 둘이 대조함
  //

  //req에 유저 있음
  //헤더에 리프뤠시토큰 따오고 그거 검증하고 레디스에서 꺼내고 비교하고
  //엑세스 리프뤠시 새로 만들고 레디스에 리프뤠시 업데이트하고
  //새로 만든 두개 쏴줌
  @Post('/reissue/access')
  @IsPublic(IsPublicEnum.ISREFRESHTOKEN)
  @UseGuards(RefreshTokenGuard)
  async reissueAccessToken(@GetUser() user: User, @GetToken() token: string) {
    const { email } = user;
    console.log(user);

    const savedRefreshtoken: string = await this.cacheManager.get(email);
    if (token !== savedRefreshtoken) {
      throw new UnauthorizedException();
    }
    const newAccessToken = this.authService.generateAccessToken(user);
    const newRefreshToken = this.authService.generateRefreshToken(user);

    this.cacheManager.del(email);
    this.cacheManager.set(email, newRefreshToken);

    return { newAccessToken, newRefreshToken };
  }
}
