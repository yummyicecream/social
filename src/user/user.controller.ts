import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { IsPublicEnum } from '../common/decorator/is-public.const';
import { GetUser } from '../common/decorator/get-param.decorator';
import { User } from '../entity/user.entity';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic(IsPublicEnum.ISREFRESHTOKEN)
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.createUser(dto);
    return CommonResponseDto.successNoContent(ResponseMessage.CREATE_SUCCESS);
  }

  @Delete()
  async deleteUser(@GetUser() user: User): Promise<CommonResponseDto<void>> {
    await this.userService.deleteUser(user);
    return CommonResponseDto.successNoContent(ResponseMessage.DELETE_SUCCESS);
  }

  @Post('/follow/:id')
  async followUser(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.followUser(followeeId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.FOLLOW_SUCCESS);
  }

  @Delete('/follow/:id')
  async unfollowUser(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.unfollowUser(followeeId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.UNFOLLOW_SUCCESS);
  }
}
