import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { CommentMapper } from '../mapper/comment.mapper';
import { CommentRepository, CreateCommentData } from '../../../../../ports/repository.port';
import { Comment } from '../../../../../domain/entities/comment';
import { CommentUserCacheEntity } from '../entities/comment-user-cache.entity';

@Injectable()
export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
    @InjectRepository(CommentUserCacheEntity)
    private readonly userCacheRepository: Repository<CommentUserCacheEntity>,
  ) {}

  async create(commentData: CreateCommentData): Promise<Comment> {
    // Use the domain entity factory method which includes validation
    const comment = Comment.create(commentData);
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
    await this.upsertUserCache(userId, username);
  }

  async findCachedUser(
    userId: number,
  ): Promise<{ userId: number; username: string } | null> {
    const entity = await this.userCacheRepository.findOne({ where: { userId } });
    if (!entity) {
      return null;
    }
    return { userId: entity.userId, username: entity.username };
  }

  async upsertUserCache(userId: number, username: string): Promise<void> {
    await this.userCacheRepository.save({ userId, username });
  }
}
