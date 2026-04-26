import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { BlogMapper } from '../mapper/blog.mapper';
import { BlogRepository } from '../../../../../ports/repository.port';
import { Blog } from '../../../../../domain/entities/blog';
import { BlogUserCacheEntity } from '../entities/blog-user-cache.entity';

@Injectable()
export class TypeOrmBlogRepository implements BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly repository: Repository<BlogEntity>,
    @InjectRepository(BlogUserCacheEntity)
    private readonly userCacheRepository: Repository<BlogUserCacheEntity>,
  ) {}

  async create(blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog> {
    const entity = BlogMapper.toEntity(blog);
    const saved = await this.repository.save(entity);
    return BlogMapper.toDomain(saved);
  }

  async findAll(skip: number, take: number): Promise<Blog[]> {
    const entities = await this.repository.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return entities.map(BlogMapper.toDomain);
  }

  async findOne(id: number): Promise<Blog | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BlogMapper.toDomain(entity) : null;
  }

  async updateAuthorName(userId: number, authorName: string): Promise<void> {
    await this.repository.update({ userId }, { authorName });
    await this.upsertUserCache(userId, authorName);
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
