import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Category } from './category.entity';

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

  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images: Image[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
