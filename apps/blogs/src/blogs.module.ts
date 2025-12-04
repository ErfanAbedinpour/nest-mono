import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './adapter/driving/controllers/http/blogs.controller';
import { BlogsService } from './application/services/blogs.service';
import { BlogRepository } from './ports/repository.port';
import { TypeOrmBlogRepository } from './adapter/driven/persistence/typeorm/repository/typeorm.blog.repository';
import { BlogEntity } from './adapter/driven/persistence/typeorm/entities/blog.entity';
import { CreateBlogHandler } from './application/handler/create-blog.handler';
import { FindAllBlogsHandler } from './application/handler/find-all-blogs.handler';
import { FindOneBlogHandler } from './application/handler/find-one-blog.handler';
import { SessionGuard } from './adapter/driving/guards/session.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_NAME || ':memory:',
      entities: [BlogEntity],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([BlogEntity]),
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    {
      provide: BlogRepository,
      useClass: TypeOrmBlogRepository,
    },
    CreateBlogHandler,
    FindAllBlogsHandler,
    FindOneBlogHandler,
    SessionGuard,
  ],
})
export class BlogsModule {}
