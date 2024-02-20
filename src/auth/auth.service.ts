import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async userLogin(dto: LoginDto) {
    const { email, password } = dto;
    const signedInUser = await this.userService.findUserByEmail(email);
    // 저장되어있는 해쉬된 비밀번호와 생비밀번호 compare
    const checkIfMatches = await bcrypt.compare(
      password,
      signedInUser.password,
    );
    if (!checkIfMatches) {
      throw new UnauthorizedException();
    }

    const userId = signedInUser.id;
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: number): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '2h' });
  }
  private generateRefreshToken(userId: number): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
  }
}
