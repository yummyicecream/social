import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { AwsModule } from '../aws/aws.module';
import { Image } from '../entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image]), AwsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
