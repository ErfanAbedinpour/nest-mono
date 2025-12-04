import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCommentCommand } from '../command/create-comment.command';
import { FindCommentsByBlogIdQuery } from '../query/find-comments-by-blog-id.query';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('BLOGS_SERVICE') private readonly blogsClient: ClientProxy,
  ) {}

  async create(content: string, blogId: number, userId: number) {
    // Validate Blog Existence via Microservice
    try {
      const blog = await firstValueFrom(
        this.blogsClient.send({ cmd: 'get_blog' }, { id: blogId }),
      );
      if (!blog) {
        throw new NotFoundException(`Blog with id ${blogId} not found`);
      }
    } catch (error) {
      throw new NotFoundException(
        `Blog with id ${blogId} not found or service unavailable`,
      );
    }

    return this.commandBus.execute(
      new CreateCommentCommand(content, blogId, userId),
    );
  }

  async findByBlogId(blogId: number) {
    return this.queryBus.execute(new FindCommentsByBlogIdQuery(blogId));
  }
}
