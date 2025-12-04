import { Controller } from '@nestjs/common';
import { CommentsService } from '../../../../application/services/comments.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({ cmd: 'create_comment' })
  async create(data: { content: string; blogId: number; userId: number }) {
    return this.commentsService.create(data.content, data.blogId, data.userId);
  }

  @MessagePattern({ cmd: 'find_comments_by_blog_id' })
  async findByBlogId(data: { blogId: number }) {
    return this.commentsService.findByBlogId(data.blogId);
  }
}
