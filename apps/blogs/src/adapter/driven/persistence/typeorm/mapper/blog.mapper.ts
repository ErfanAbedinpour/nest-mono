import { Blog } from '../../../../../domain/entities/blog';
import { BlogEntity } from '../entities/blog.entity';

export class BlogMapper {
  static toDomain(entity: BlogEntity): Blog {
    return new Blog(
      entity.id,
      entity.title,
      entity.description,
      entity.content,
      entity.userId,
      entity.createdAt,
      entity.status,
    );
  }

  static toEntity(domain: Omit<Blog, 'id' | 'createdAt'>): BlogEntity {
    const entity = new BlogEntity();
    entity.title = domain.title;
    entity.description = domain.description;
    entity.content = domain.content;
    entity.userId = domain.userId;
    entity.status = domain.status;
    return entity;
  }
}
