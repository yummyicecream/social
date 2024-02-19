import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Post extends Base {
  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
  })
  author: User;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;
}
