import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MaxLength(10)
  readonly nickname: string;

  @IsNotEmpty()
  @MaxLength(20)
  readonly password: string;
}
