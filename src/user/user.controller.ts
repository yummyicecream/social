import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.createUser(dto);
    return CommonResponseDto.successNoContent(ResponseMessage.CREATE_SUCCESS);
  }
}
