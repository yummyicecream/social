import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateDateColumn } from 'typeorm';

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
  //private 계정이면 pending, public 계정이면 follow
  @Post('/follow/:id')
  async followUser(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<ResponseMessage>> {
    // 공개계정여부 체크 후 라우팅해줌
    const responseMessage = await this.userService.followUser(followeeId, user);
    return CommonResponseDto.successNoContent(responseMessage);
  }

  @Delete('/follow/:id')
  async unfollowUser(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.unfollowUser(followeeId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.UNFOLLOW_SUCCESS);
  }
  //펜딩날리는거
  // @Post('/follow/private/:id')
  // async followPrivateUser(
  //   @Param('id', ParseIntPipe) followId: number,
  //   @GetUser() user: User,
  // ) {
  //   await this.userService.followPrivateUser(followId, user);
  // }
  //펜딩값 변경해주고 팔로잉수 수정해줌
  @Patch('/follow/confirm/:id')
  async confirmPendingFollow(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.confirmPendingFollow(followeeId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.FOLLOW_SUCCESS);
  }

  @Delete('/follow/confirm/:id')
  async rejectPendingFollow(
    @Param('id', ParseIntPipe) followeeId: number,
    @GetUser() user: User,
  ) {
    await this.userService.rejectPendingFollow(followeeId, user);
  }
}
