import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from '../entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../entity/post.entity';
import { v4 as uuid } from 'uuid';
import { AwsService } from '../aws/aws.service';
import { Image } from '../entity/image.entity';
import { Category } from '../entity/category.entity';
import { SecurityLevelEnum } from '../entity/enum/security-level.enum';
import { Follow } from '../entity/follow.entity';
import { FollowStatusEnum } from '../entity/enum/follow-status.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly awsService: AwsService,
  ) {}

  async createPost(
    user: User,
    dto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const { title, content, category, securityLevel } = dto;

    const compareCategory = await this.categoryRepository.findOneBy({
      name: category,
    });
    if (!compareCategory) {
      throw new NotFoundException('CATEGORY_NOT_FOUND');
    }

    //aws 저장하고 imgurl 반환
    const imgUrl = await this.saveImage(file);
    //이미지 객체 생성
    try {
      const image = this.imageRepository.create({
        url: imgUrl,
      });
      //포스트 객체 생성 (이미지 객체 및 정보 주입)
      const post = this.postRepository.create({
        title,
        content,
        author: user,
        images: [image],
        category: compareCategory,
        securityLevel: securityLevel,
      });
      //포스트객체 저장
      await this.postRepository.save(post);
    } catch (error) {
      //에러 터지면 aws 삭제
      await this.deleteImage(imgUrl);
    }
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

  async getPostById(postId: number, user: User): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author', 'images'],
    });
    console.log(post);
    if (!post) {
      throw new NotFoundException('POST_NOT_FOUND');
    }
    if (post.securityLevel === SecurityLevelEnum.PUBLIC) {
      return new PostResponseDto(post);
    } else if (post.securityLevel === SecurityLevelEnum.ONLYFOLLOWERS) {
      const follow = await this.followRepository.findOne({
        where: {
          followee: { id: post.author.id },
          follower: { id: user.id },
          status: FollowStatusEnum.CONFIRMED,
        },
      });
      console.log(follow);
      if (!follow) {
        throw new UnauthorizedException('ACCESS_DENIED_FOLLOWERS_ONLY');
      }
      if (follow.status === FollowStatusEnum.CONFIRMED) {
        return new PostResponseDto(post);
      }
    } else if (post.securityLevel === SecurityLevelEnum.SECRET) {
      throw new UnauthorizedException('ACCESS_DENIED_PRIVATE_POST');
    }
  }

  async deletePost(user: User, postId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        author: { id: user.id },
      },
      relations: {
        images: true,
      },
    });

    if (!post) {
      throw new NotFoundException('NO_MATCHING_POST');
    }
    const imgUrl = post.images[0].url;
    this.deleteImage(imgUrl);
    await this.postRepository.remove(post);
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();
    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return imageUrl;
  }

  async deleteImage(imgUrl: string) {
    const fileName = imgUrl.match(/\/([^\/?#]+)[^\/]*$/)[1];
    await this.awsService.deleteImageFromS3(fileName);
  }
}
