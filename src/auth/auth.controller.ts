import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async userLogin(@Body() dto: LoginDto) {
    const result = await this.authService.userLogin(dto);
    return result;
  }
}
