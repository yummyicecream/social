import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { Post } from '../entity/post.entity';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPosts(query: PaginatePostDto): Promise<{
        data: Post[];
    }>;
    get(): Promise<Post[]>;
}
