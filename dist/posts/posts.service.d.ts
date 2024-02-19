import { PaginatePostDto } from './dto/paginate-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../entity/post.entity';
export declare class PostsService {
    private readonly postRepository;
    constructor(postRepository: Repository<Post>);
    paginatePosts(dto: PaginatePostDto): Promise<{
        data: Post[];
    }>;
}
