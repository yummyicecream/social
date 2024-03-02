import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Category } from './category.entity';
import { SecurityLevelEnum } from './enum.ts/security-level.enum';

@Entity()
export class Post extends Base {
  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @Column({
    type: 'enum',
    enum: SecurityLevelEnum,
    default: SecurityLevelEnum.PUBLIC,
  })
  securityLevel: SecurityLevelEnum;

  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images: Image[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
