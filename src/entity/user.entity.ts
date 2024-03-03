import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../common/validation/validation-message';
import { Post } from './post.entity';
import { Follow } from './follow.entity';
import { UserRoleEnum } from './enum/user-role.enum';
import { PrivacyStatusEnum } from './enum/privacy-status.enum';

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

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  role: UserRoleEnum;

  @Column({
    type: 'enum',
    enum: PrivacyStatusEnum,
    default: PrivacyStatusEnum.PUBLIC,
  })
  privacyStatus: PrivacyStatusEnum;

  @Column({
    default: 0,
  })
  followerCount: number;

  @Column({
    default: 0,
  })
  followeeCount: number;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Follow, (follow) => follow.followee)
  followees: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];
}
