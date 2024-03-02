import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SecurityLevelEnum } from '../../entity/enum/security-level.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  readonly content: string;

  @IsNotEmpty()
  readonly category: string;

  @IsEnum(SecurityLevelEnum)
  readonly securityLevel: SecurityLevelEnum;
}
