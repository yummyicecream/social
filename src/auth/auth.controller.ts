import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { RefreshTokenGuard } from './guard/token-auth.guard';
import { GetToken, GetUser } from '../common/decorator/get-user.decorator';
import { User } from '../entity/user.entity';
import { IsPublicEnum } from '../common/decorator/is-public.const';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @IsPublic(IsPublicEnum.ISPUBLIC)
  async userLogin(@Body() dto: LoginDto): Promise<CommonResponseDto<TokenDto>> {
    const result = await this.authService.userLogin(dto);
    return CommonResponseDto.success(ResponseMessage.LOGIN_SUCCESS, result);
  }

  //리프레쉬 토큰을 받아서 아이디를 까고 그 아이디로 레디스에서 리프뤠시 조회함
  //리프뤠시 조회해서 둘이 대조함
  //req에 유저 있음
  //헤더에 리프뤠시토큰 따오고 그거 검증하고 레디스에서 꺼내고 비교하고
  //엑세스 리프뤠시 새로 만들고 레디스에 리프뤠시 업데이트하고
  //새로 만든 두개 쏴줌
  @Post('/reissue/access')
  @IsPublic(IsPublicEnum.ISREFRESHTOKEN)
  @UseGuards(RefreshTokenGuard)
  async reissueAccessToken(
    @GetUser() user: User,
    @GetToken() token: string,
  ): Promise<CommonResponseDto<TokenDto>> {
    const result = await this.authService.reissueAccessToken(user, token);
    return CommonResponseDto.success(ResponseMessage.CREATE_SUCCESS, result);
  }

  //레디스에 저장된 리프뤠시토큰 삭제
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async userLogout(@GetUser() user: User): Promise<CommonResponseDto<void>> {
    await this.authService.deleteRefreshToken(user);
    return CommonResponseDto.successNoContent(ResponseMessage.DELETE_SUCCESS);
  }
}
