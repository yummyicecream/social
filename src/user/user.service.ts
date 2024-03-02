import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
