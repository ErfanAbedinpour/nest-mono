import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('text')
  content: string;

  @Column()
  blogId: number;

  @Column()
  authorUsername: string;

  @Column()
  userId: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
