import { Blog } from '../domain/entities/blog';

export abstract class BlogRepository {
  abstract create(blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog>;
  abstract findAll(skip: number, take: number): Promise<Blog[]>;
  abstract findOne(id: number): Promise<Blog | null>;
}

