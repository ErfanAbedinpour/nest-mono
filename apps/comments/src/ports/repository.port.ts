import { Comment } from '../domain/entities/comment';

export interface CreateCommentData {
  content: string;
  blogId: number;
  userId: number;
  authorUsername: string;
}

export abstract class CommentRepository {
  abstract create(commentData: CreateCommentData): Promise<Comment>;
  abstract findByBlogId(blogId: number): Promise<Comment[]>;
  abstract updateAuthorUsername(userId: number, username: string): Promise<void>;
  abstract findCachedUser(userId: number): Promise<{ userId: number; username: string } | null>;
  abstract upsertUserCache(userId: number, username: string): Promise<void>;
}
