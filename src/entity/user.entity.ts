import { Column } from 'typeorm';
import { Base } from './base.entity';
import { IsString, Length } from 'class-validator';

export class User extends Base {
    @Column()
    @IsString()
    @Length(1, 20, {message: ''})
}
