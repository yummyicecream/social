import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
@Entity()
@Unique(['followee', 'follower'])
export class Follow extends Base {
  @ManyToOne(() => User, (user) => user.followees)
  @JoinColumn({ name: 'followee_id' })
  followee: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: User;
}
