import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { CommentMapper } from '../mapper/comment.mapper';
import { CommentRepository } from '../../../../../ports/repository.port';
import { Comment } from '../../../../../domain/entities/comment';

@Injectable()
export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
  ) {}

  async create(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const entity = CommentMapper.toEntity(comment);
    const saved = await this.repository.save(entity);
    return CommentMapper.toDomain(saved);
  }

  async findByBlogId(blogId: number): Promise<Comment[]> {
    const entities = await this.repository.find({
      where: { blogId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(CommentMapper.toDomain);
  }

  async updateAuthorUsername(userId: number, username: string): Promise<void> {
    await this.repository.update({ userId }, { authorUsername: username });
  }
}
