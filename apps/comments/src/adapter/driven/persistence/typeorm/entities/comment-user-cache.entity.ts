import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'comment_user_cache' })
export class CommentUserCacheEntity {
  @PrimaryColumn({ unsigned: true })
  userId!: number;

  @Column()
  username!: string;
}
