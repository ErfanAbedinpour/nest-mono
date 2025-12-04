import { User } from '../../../../../domain/entities/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(user: UserEntity): User {
    const userDomain = new User();
    userDomain.id = user.id.toString();
    userDomain.username = user.username;
    userDomain.password = user.password;
    userDomain.createdAt = user.createdAt;
    return userDomain;
  }
}
