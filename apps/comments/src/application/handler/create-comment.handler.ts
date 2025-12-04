import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCommentCommand } from '../command/create-comment.command';
import { CommentRepository } from '../../ports/repository.port';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly repository: CommentRepository,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async execute(command: CreateCommentCommand) {
    console.log('i ma here');
    let user;
    try {
      user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'find_one_user' },
          { id: +command.userId },
        ),
      );
    } catch (error) {
      console.error(error);
      throw new Error('User not found');
    }

    console.log({ user });
    console.log({ userId: command.userId });

    return this.repository.create({
      content: command.content,
      blogId: command.blogId,
      userId: command.userId,
      authorUsername: user.username,
    });
  }
}
