import { Comment } from '../domain/entities/comment';

export abstract class CommentRepository {
  abstract create(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>;
  abstract findByBlogId(blogId: number): Promise<Comment[]>;
  abstract updateAuthorUsername(userId: number, username: string): Promise<void>;
}
