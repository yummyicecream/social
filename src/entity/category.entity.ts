import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Category extends Base {
  @Column()
  name: string;
}
