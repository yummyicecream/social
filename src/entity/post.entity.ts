import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

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
