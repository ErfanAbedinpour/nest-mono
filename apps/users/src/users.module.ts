import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './adapter/driven/persistence/typeorm/entities/user.entity';
import { UsersController } from './adapter/driving/controllers/http/users.controller';
import { UsersService } from './application/services/users.service';
import { UserRepository } from './ports/repository.port';
import { TypeOrmRepository } from './adapter/driven/persistence/typeorm/repository/typeorm.repository';
import { CreateUserHandler } from './application/handler/create-user.handler';
import { FindOneUserHandler } from './application/handler/find-one-by-id.handler';
import { GetAllUserHandler } from './application/handler/findAll.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: `:memory:`,
      entities: [UserEntity],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule.forRoot({}),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: TypeOrmRepository,
    },
    CreateUserHandler,
    FindOneUserHandler,
    GetAllUserHandler,
  ],
})
export class UsersModule {}
