import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { FollowStatusEnum } from './enum/follow-status.enum';
@Entity()
@Unique(['followee', 'follower'])
export class Follow extends Base {
  @ManyToOne(() => User, (user) => user.followees)
  @JoinColumn({ name: 'followee_id' })
  followee: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Column({
    type: 'enum',
    enum: FollowStatusEnum,
    default: FollowStatusEnum.CONFIRMED,
  })
  status: FollowStatusEnum;
}
