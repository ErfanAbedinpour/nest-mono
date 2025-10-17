import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../infra/persistence/typeorm/user.entity';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async checkUserNameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ? true : false;
  }

  async createUser(username: string, password: string): Promise<void> {
    if (await this.checkUserNameExists(username)) {
      throw new Error('Username already exists');
    }

    const user = await this.userRepository.create({ username, password });
    await this.userRepository.save(user);
  }
  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user
      ? User.create({
          id: user.id,
          username: user.username,
          password: user.password,
        })
      : null;
  }
}
