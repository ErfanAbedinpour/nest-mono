import { Comment } from '../../../../../domain/entities/comment';
import { CommentEntity } from '../entities/comment.entity';

export class CommentMapper {
  static toDomain(entity: CommentEntity): Comment {
    console.log('entity is ', entity);

    return new Comment(
      entity.id,
      entity.content,
      entity.blogId,
      entity.userId,
      entity.authorUsername || 'defaul',
      entity.createdAt,
    );
  }

  static toEntity(domain: Omit<Comment, 'id' | 'createdAt'>): CommentEntity {
    const entity = new CommentEntity();
    entity.content = domain.content;
    entity.blogId = domain.blogId;
    entity.userId = domain.userId;
    entity.authorUsername = domain.authorUsername;
    return entity;
  }
}
