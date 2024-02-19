import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt: string = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
