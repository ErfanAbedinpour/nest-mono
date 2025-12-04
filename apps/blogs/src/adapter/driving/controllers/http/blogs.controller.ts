import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from '../../../../application/services/blogs.service';
import { SessionGuard } from '../../guards/session.guard';
import { BlogStatus } from '../../../../domain/entities/blog';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @MessagePattern({ cmd: 'get_blog' })
  async getBlog(data: { id: number }) {
    return this.blogsService.findOne(data.id);
  }

  @Post()
  @UseGuards(SessionGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'] },
      },
    },
  })
  async create(@Body() body: any, @Request() req: any) {
    const userId = req.user.id;
    return this.blogsService.create(
      body.title,
      body.description,
      body.content,
      userId,
      body.status as BlogStatus,
    );
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    return this.blogsService.findAll(skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogsService.findOne(+id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  }
}
