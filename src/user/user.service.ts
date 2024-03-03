import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Follow } from '../entity/follow.entity';
import { FollowStatusEnum } from '../entity/enum/follow-status.enum';
import { PrivacyStatusEnum } from '../entity/enum/privacy-status.enum';
import { ResponseMessage } from '../common/dto/response-message.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const { email, password, nickname } = dto;
    const check: boolean = await this.userRepository.existsBy({ email });
    if (check) throw new ConflictException('EMAIL_EXISTS');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const user = this.userRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
  }

  async deleteUser(user: User): Promise<void> {
    const foundUser = await this.userRepository.findOneBy(user);
    if (!foundUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    await this.userRepository.remove(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });
    return user;
  }

  async followUser(followeeId: number, user: User): Promise<ResponseMessage> {
    if (followeeId === user.id) {
      throw new BadRequestException('CANNOT_FOLLOW_YOURSELF');
    }
    const followee = await this.userRepository.findOneBy({
      id: followeeId,
    });
    if (!followee) {
      throw new NotFoundException('FOLLOWEE_NOT_FOUND');
    }

    if (followee.privacyStatus === PrivacyStatusEnum.PRIVATE) {
      //여기 로직
      const instance = this.followRepository.create({
        followee,
        follower: user,
        status: FollowStatusEnum.PENDING,
      });
      await this.followRepository.save(instance);

      return ResponseMessage.PENDING_SUCCESS;
    } else {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await this.userRepository.increment(
          {
            id: followeeId,
          },
          'followerCount',
          1,
        );
        await this.userRepository.increment(
          {
            id: user.id,
          },
          'followeeCount',
          1,
        );

        const follow = this.followRepository.create({
          followee,
          follower: user,
        });
        await queryRunner.manager
          .withRepository(this.followRepository)
          .save(follow);
        await queryRunner.commitTransaction();
        return ResponseMessage.FOLLOW_SUCCESS;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new BadRequestException('FOLLOW_EXISTS');
      } finally {
        await queryRunner.release();
      }
    }
  }

  async unfollowUser(followeeId: number, user: User): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followee: { id: followeeId }, follower: { id: user.id } },
    });
    if (!follow) {
      throw new NotFoundException('FOLLOW_RELATION_NOT_EXISTS');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.decrement(
        {
          id: followeeId,
        },
        'followerCount',
        1,
      );
      await this.userRepository.decrement(
        {
          id: user.id,
        },
        'followeeCount',
        1,
      );
      await queryRunner.manager
        .withRepository(this.followRepository)
        .remove(follow);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //   async followPrivateUser(followeeId: number, user: User) {
  //     const followee = await this.userRepository.findOneBy({
  //       id: followeeId,
  //     });
  //     const instance = this.followRepository.create({
  //       followee,
  //       follower: user,
  //       status: FollowStatusEnum.PENDING,
  //     });
  //     await this.followRepository.save(instance);
  //   }
}
