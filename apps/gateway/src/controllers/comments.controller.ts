import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    @Inject('COMMENTS_SERVICE') private readonly commentsClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        blogId: { type: 'number' },
      },
    },
  })
  async create(@Body() body: any, @Request() req: any) {
    return this.commentsClient.send(
      { cmd: 'create_comment' },
      { ...body, userId: req.user.id },
    );
  }

  @Get()
  @ApiQuery({ name: 'blogId', required: true, type: Number })
  async findByBlogId(@Query('blogId') blogId: number) {
    return this.commentsClient.send(
      { cmd: 'find_comments_by_blog_id' },
      { blogId },
    );
  }
}
