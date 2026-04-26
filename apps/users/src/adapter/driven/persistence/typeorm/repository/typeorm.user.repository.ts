import { Injectable } from '@nestjs/common';
import { UserRepository, CreateUserData } from '../../../../../ports/repository.port';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../../domain/entities/user';
import { UserMapper } from '../mapper/user.mapper';
import { PasswordHasher } from '../../../../../ports/password-hasher.port';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private passwordHasher: PasswordHasher,
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

  async create(userData: CreateUserData): Promise<User> {
    // Hash the password using the injected PasswordHasher service
    const hashedPassword = await this.passwordHasher.hash(userData.password);

    // Use the domain entity factory method which includes validation
    const user = User.create({
      username: userData.username,
      password: userData.password, // plain password for validation
      hashedPassword, // hashed password to store
    });

    const userEntity = this.userRepository.create({
      password: user.password, // already hashed
      username: user.username,
    });
    await this.userRepository.save(userEntity);
    return UserMapper.toDomain(userEntity);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { username },
    });
    return userEntity && UserMapper.toDomain(userEntity);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(
      { id },
      {
        ...(user.username && { username: user.username }),
      },
    );
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return UserMapper.toDomain(updatedUser!);
  }
}
