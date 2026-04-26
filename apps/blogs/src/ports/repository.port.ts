import { Blog } from '../domain/entities/blog';

export abstract class BlogRepository {
  abstract create(blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog>;
  abstract findAll(skip: number, take: number): Promise<Blog[]>;
  abstract findOne(id: number): Promise<Blog | null>;
  abstract updateAuthorName(userId: number, authorName: string): Promise<void>;
  abstract findCachedUser(userId: number): Promise<{ userId: number; username: string } | null>;
  abstract upsertUserCache(userId: number, username: string): Promise<void>;
}
