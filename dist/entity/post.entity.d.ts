import { Base } from './base.entity';
import { User } from './user.entity';
export declare class Post extends Base {
    author: User;
    title: string;
    content: string;
}
