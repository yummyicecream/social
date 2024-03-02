import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../common/validation/validation-message';
import { Post } from './post.entity';
import { Follow } from './follow.entity';

@Entity()
export class User extends Base {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string;

  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Follow, (follow) => follow.followee)
  followees: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];
}
