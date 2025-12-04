import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCommentCommand } from '../command/create-comment.command';
import { FindCommentsByBlogIdQuery } from '../query/find-comments-by-blog-id.query';
import { AppException } from '../../../../../libs/_shared/src/error/app.exception';
import { ErrorCode } from '../../../../../libs/_shared/src/error/error-codes';

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
        throw new AppException(ErrorCode.BLOG_NOT_FOUND);
      }
    } catch (error) {
      throw new AppException(ErrorCode.BLOG_NOT_FOUND);
    }

    return this.commandBus.execute(
      new CreateCommentCommand(content, blogId, userId),
    );
  }

  async findByBlogId(blogId: number) {
    return this.queryBus.execute(new FindCommentsByBlogIdQuery(blogId));
  }
}
