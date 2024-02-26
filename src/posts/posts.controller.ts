import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { PostResponseDto } from './dto/post-response.dto';
import { GetUser } from '../common/decorator/get-user.decorator';
import { User } from '../entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(
    @GetUser() user: User,
    @Body() dto: CreatePostDto,
  ): Promise<CommonResponseDto<void>> {
    await this.postsService.createPost(user, dto);
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
  async getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':postId')
  async getPostById(
    @Param('postId', ParseIntPipe) id: number,
  ): Promise<CommonResponseDto<PostResponseDto>> {
    const post = await this.postsService.getPostById(id);
    return CommonResponseDto.success(ResponseMessage.READ_SUCCESS, post);
  }

  // @Delete(':id')
  // async deletePostById(@Param('id', ParseIntPipe) id: number) {
  //   const post = await this.postsService.getPostById(id);
  //   if (!post) {
  //     throw new NotFoundException();
  //   }
  //   await this.postsService.deletePost(post);
  //   return CommonResponseDto.successNoContent(ResponseMessage.DELETE_SUCCESS);
  // }
}
