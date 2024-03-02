import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { PostResponseDto } from './dto/post-response.dto';
import { GetUser } from '../common/decorator/get-param.decorator';
import { User } from '../entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { IsPublicEnum } from '../common/decorator/is-public.const';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('image')
  @IsPublic(IsPublicEnum.ISPUBLIC)
  @UseInterceptors(FileInterceptor('file'))
  async saveImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommonResponseDto<string>> {
    const imgUrl = await this.postsService.saveImage(file);
    return CommonResponseDto.success(ResponseMessage.CREATE_SUCCESS, imgUrl);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @GetUser() user: User,
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommonResponseDto<void>> {
    //aws에 올리는거
    //이미지객체 생성
    //포스트repository 이미지객체 넣고 저장
    //try
    await this.postsService.createPost(user, dto, file);
    return CommonResponseDto.successNoContent(ResponseMessage.CREATE_SUCCESS);
  }
  @Post(':postId')
  async modifyPost(
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreatePostDto,
  ): Promise<CommonResponseDto<void>> {
    await this.postsService.modifyPost(user, postId, dto);
    return CommonResponseDto.successNoContent(ResponseMessage.UPDATE_SUCCESS);
  }

  @Delete(':postId')
  async deletePost(
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommonResponseDto<void>> {
    await this.postsService.deletePost(user, postId);
    return CommonResponseDto.successNoContent(ResponseMessage.DELETE_SUCCESS);
  }

  @Get()
  @IsPublic(IsPublicEnum.ISPUBLIC)
  async getPosts(@Query() query: PaginatePostDto) {
    console.log(query);
    return this.postsService.paginatePosts(query);
  }

  @Get(':postId')
  @IsPublic(IsPublicEnum.ISPUBLIC)
  async getPostById(
    @Param('postId', ParseIntPipe) id: number,
  ): Promise<CommonResponseDto<PostResponseDto>> {
    const post = await this.postsService.getPostById(id);
    return CommonResponseDto.success(ResponseMessage.READ_SUCCESS, post);
  }
}

//유저의 게시물 전체조회 (공개 계정이면 ispublic, 비공개 계정이면 followcheck)
