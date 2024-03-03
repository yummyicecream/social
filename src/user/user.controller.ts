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
  ): Promise<CommonResponseDto<ResponseMessage>> {
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

  @Patch('/follow/confirm/:id')
  async confirmPendingFollow(
    @Param('id', ParseIntPipe) followerId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.confirmPendingFollow(followerId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.FOLLOW_SUCCESS);
  }

  @Delete('/follow/confirm/:id')
  async rejectPendingFollow(
    @Param('id', ParseIntPipe) followerId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.rejectPendingFollow(followerId, user);
    return CommonResponseDto.successNoContent(ResponseMessage.UNFOLLOW_SUCCESS);
  }

  @Patch('privacy')
  async switchPrivacyStatus(@GetUser() user: User) {
    await this.userService.switchPrivacyStatus(user);
    return CommonResponseDto.successNoContent(ResponseMessage.UPDATE_SUCCESS);
  }
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

//펜딩 요청 취소?
//펜딩이랑 팔로우랑 합쳐놓은 상태
//follower followee guard?
