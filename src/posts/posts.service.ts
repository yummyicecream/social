import { Injectable, Post } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>)
  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postRepository.find;
  }
}
