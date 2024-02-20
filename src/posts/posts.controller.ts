import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
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
