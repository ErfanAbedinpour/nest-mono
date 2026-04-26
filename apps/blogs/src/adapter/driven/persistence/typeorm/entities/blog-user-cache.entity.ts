import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blog_user_cache' })
export class BlogUserCacheEntity {
  @PrimaryColumn({ unsigned: true })
  userId!: number;

  @Column()
  username!: string;
}
