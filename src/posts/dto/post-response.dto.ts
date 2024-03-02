import { SecurityLevelEnum } from '../../entity/enum/security-level.enum';
import { Post } from '../../entity/post.entity';
import { User } from '../../entity/user.entity';

export class PostResponseDto {
  private id: number;

  private title: string;

  private content: string;

  private author: User;

  private securityLevel: SecurityLevelEnum;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
    this.securityLevel = post.securityLevel;
  }
}
