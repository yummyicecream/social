import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { Post } from '../entity/post.entity';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query: PaginatePostDto) {
    console.log('query', query);
    return this.postsService.paginatePosts(query);
  }

  @Get('/all')
  async get(): Promise<Post[]> {
    return this.postsService.get();
  }
}
