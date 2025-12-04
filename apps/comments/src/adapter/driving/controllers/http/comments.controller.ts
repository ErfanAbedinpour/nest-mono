import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from '../../../../application/services/comments.service';
import { SessionGuard } from '../../guards/session.guard';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(SessionGuard)
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
    const userId = req.user.id;
    return this.commentsService.create(body.content, body.blogId, userId);
  }

  @Get()
  @ApiQuery({ name: 'blogId', required: true, type: Number })
  async findByBlogId(@Query('blogId') blogId: number) {
    return this.commentsService.findByBlogId(blogId);
  }
}
