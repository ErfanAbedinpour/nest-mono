import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../../ports/repository.port';
import { UserEntity } from '../entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../../domain/entities/user';
import { UserMapper } from '../mapper/toUser.mapper';

@Injectable()
export class TypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map((userEntity) =>
      UserMapper.toDomain(userEntity),
    );
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id: Number(id) },
    });

    return userEntity && UserMapper.toDomain(userEntity);
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const userEntity = this.userRepository.create(user);
    await this.userRepository.save(userEntity);
    return UserMapper.toDomain(userEntity);
  }
  async findOneByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { username },
    });
    return userEntity && UserMapper.toDomain(userEntity);
  }
}
