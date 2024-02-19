import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPosts(query: PaginatePostDto): Promise<{
        data: import("../entity/post.entity").Post[];
    }>;
}
