import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Follow extends Base {
  @ManyToOne(() => User, (user) => user.followees)
  @JoinColumn({ name: 'followee_id' })
  followee: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: User;
}
