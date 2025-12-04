import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../command/create-blog.command';
import { FindAllBlogsQuery } from '../query/find-all-blogs.query';
import { FindOneBlogQuery } from '../query/find-one-blog.query';
import { BlogStatus } from '../../domain/entities/blog';

@Injectable()
export class BlogsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    title: string,
    description: string,
    content: string,
    userId: number,
    status: BlogStatus = BlogStatus.DRAFT,
  ) {
    return this.commandBus.execute(
      new CreateBlogCommand(title, description, content, userId, status),
    );
  }

  async findAll(skip: number = 0, take: number = 10) {
    return this.queryBus.execute(new FindAllBlogsQuery(skip, take));
  }

  async findOne(id: number) {
    return this.queryBus.execute(new FindOneBlogQuery(id));
  }
}
