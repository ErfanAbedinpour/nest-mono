import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentsController } from './adapter/driving/controllers/http/comments.controller';
import { CommentsService } from './application/services/comments.service';
import { CommentRepository } from './ports/repository.port';
import { TypeOrmCommentRepository } from './adapter/driven/persistence/typeorm/repository/typeorm.comment.repository';
import { CommentEntity } from './adapter/driven/persistence/typeorm/entities/comment.entity';
import { CreateCommentHandler } from './application/handler/create-comment.handler';
import { FindCommentsByBlogIdHandler } from './application/handler/find-comments-by-blog-id.handler';
import { SessionGuard } from './adapter/driving/guards/session.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_NAME || ':memory:',
      entities: [CommentEntity],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([CommentEntity]),
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
      {
        name: 'BLOGS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: CommentRepository,
      useClass: TypeOrmCommentRepository,
    },
    CreateCommentHandler,
    FindCommentsByBlogIdHandler,
    SessionGuard,
  ],
})
export class CommentsModule {}
