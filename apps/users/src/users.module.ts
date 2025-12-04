import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './adapter/driven/persistence/typeorm/entities/user.entity';
import { UsersController } from './adapter/driving/controllers/http/users.controller';
import { UsersService } from './application/services/users.service';
import { SessionRepository, UserRepository } from './ports/repository.port';
import { TypeOrmUserRepository } from './adapter/driven/persistence/typeorm/repository/typeorm.user.repository';
import { CreateUserHandler } from './application/handler/create-user.handler';
import { FindOneUserHandler } from './application/handler/find-one-by-id.handler';
import { GetAllUserHandler } from './application/handler/findAll.handler';
import { TypeOrmSessionRepository } from './adapter/driven/persistence/typeorm/repository/typeorm-session.respository';
import { SessionEntity } from './adapter/driven/persistence/typeorm/entities/session.entity';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './adapter/driving/controllers/http/auth.controller';
import { LoginHandler } from './application/handler/login.user-handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: `:memory:`,
      entities: [UserEntity, SessionEntity],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
    CqrsModule.forRoot({}),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: SessionRepository,
      useClass: TypeOrmSessionRepository,
    },
    CreateUserHandler,
    FindOneUserHandler,
    GetAllUserHandler,
    LoginHandler,
  ],
})
export class UsersModule {}
