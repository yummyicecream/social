import { Base } from './base.entity';
import { Post } from './post.entity';
export declare class User extends Base {
    nickname: string;
    email: string;
    password: string;
    role: string;
    posts: Post[];
}
