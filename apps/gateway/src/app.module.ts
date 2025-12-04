import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controllers/auth.controller';
import { BlogsController } from './controllers/blogs.controller';
import { CommentsController } from './controllers/comments.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
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
      {
        name: 'COMMENTS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [
    AuthController,
    BlogsController,
    CommentsController,
    UsersController,
  ],
})
export class AppModule {}
