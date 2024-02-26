import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from '../entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../entity/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(user: User, dto: CreatePostDto): Promise<void> {
    const { title, content } = dto;

    const post = this.postRepository.create({
      title,
      content,
      author: user,
    });
    await this.postRepository.save(post);
  }
  async modifyPost(
    user: User,
    postId: number,
    dto: CreatePostDto,
  ): Promise<void> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        author: { id: user.id },
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    this.postRepository.update(
      {
        id: postId,
      },
      {
        title: dto.title,
        content: dto.content,
      },
    );
  }

  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than),
      },
      order: { createdAt: dto.order__createdAt },
      take: dto.take,
    });
    return { data: posts };
  }

  async getPostById(postId: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException();
    }
    return new PostResponseDto(post);
  }

  async deletePost(post: Post) {
    await this.postRepository.delete(post);
  }
}
