import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../common/validation/validation-message';
import { Post } from './post.entity';

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

  role: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
