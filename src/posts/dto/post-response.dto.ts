import { SecurityLevelEnum } from '../../entity/enum/security-level.enum';
import { Image } from '../../entity/image.entity';
import { Post } from '../../entity/post.entity';

export class PostResponseDto {
  private id: number;

  private title: string;

  private content: string;

  private images: Image[];

  private author: string;

  private securityLevel: SecurityLevelEnum;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.images = post.images;
    this.author = post.author.nickname;
    this.securityLevel = post.securityLevel;
  }
}
