import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { IsPublic } from '../common/decorator/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @IsPublic()
  async userLogin(@Body() dto: LoginDto) {
    const result = await this.authService.userLogin(dto);
    return result;
  }

  //리프레쉬 토큰을 받아서 아이디를 까고 그 아이디로 레디스에서 리프뤠시 조회함
  //리프뤠시 조회해서 둘이 대조함
  //
  //   @Post('/reissue')
  //   @IsPublic()
  //   async;
}
