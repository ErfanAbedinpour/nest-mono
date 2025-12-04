import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true, length: 256 })
  sessionId: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;

  @Column({ nullable: false, type: 'json' })
  metadata: Record<string, any>;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ nullable: false, type: 'date' })
  expiredAt: Date;
}
