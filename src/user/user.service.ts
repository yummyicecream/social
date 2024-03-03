import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Follow } from '../entity/follow.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
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
  //트랜젝션 유저 팔로우카운트 추가 후 팔로우 저장 안되면 롤백
  async followUser(followeeId: number, user: User): Promise<void> {
    if (followeeId === user.id) {
      throw new BadRequestException('CANNOT_FOLLOW_YOURSELF');
    }
    const followee = await this.userRepository.findOneBy({
      id: followeeId,
    });
    if (!followee) {
      throw new NotFoundException('FOLLOWEE_NOT_FOUND');
    }
    const follow = this.followRepository.create({
      followee,
      follower: user,
    });
    try {
      await this.followRepository.save(follow);
    } catch (error) {
      throw new BadRequestException('FOLLOW_EXISTS');
    }
  }

  async unfollowUser(followeeid: number, user: User): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followee: { id: followeeid }, follower: { id: user.id } },
    });
    if (!follow) {
      throw new NotFoundException('FOLLOW_RELATION_NOT_EXISTS');
    }
    await this.followRepository.remove(follow);
  }
}
