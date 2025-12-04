import { Controller } from '@nestjs/common';
import { BlogsService } from '../../../../application/services/blogs.service';
import { BlogStatus } from '../../../../domain/entities/blog';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @MessagePattern({ cmd: 'get_blog' })
  async getBlog(data: { id: number }) {
    return this.blogsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_blog' })
  async create(data: {
    title: string;
    description: string;
    content: string;
    status: string;
    userId: number;
  }) {
    return this.blogsService.create(
      data.title,
      data.description,
      data.content,
      data.userId,
      data.status as BlogStatus,
    );
  }

  @MessagePattern({ cmd: 'find_all_blogs' })
  async findAll(data: { skip: number; take: number }) {
    return this.blogsService.findAll(data.skip, data.take);
  }

  @MessagePattern({ cmd: 'find_one_blog' })
  async findOne(data: { id: string }) {
    return this.blogsService.findOne(+data.id);
  }
}
