import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { firstValueFrom } from 'rxjs';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject('BLOGS_SERVICE') private readonly blogsClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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
    return this.blogsClient.send(
      { cmd: 'create_blog' },
      { ...body, userId: req.user.id },
    );
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    return this.blogsClient.send({ cmd: 'find_all_blogs' }, { skip, take });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogsClient.send({ cmd: 'find_one_blog' }, { id });
  }
}
