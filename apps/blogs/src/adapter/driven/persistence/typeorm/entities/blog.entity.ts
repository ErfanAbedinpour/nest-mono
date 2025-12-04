import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogStatus } from '../../../../../domain';

@Entity({ name: 'blogs' })
export class BlogEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  content: string;

  @Column()
  userId: number;

  @Column()
  authorName: string;

  @Column({
    type: 'simple-enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
