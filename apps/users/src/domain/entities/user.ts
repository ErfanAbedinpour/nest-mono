import { ApiProperty } from '@nestjs/swagger';
import { Entity } from '@app/_shared/global/entity';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

export class User extends Entity {
  @ApiProperty({ type: 'string', example: 'john_doe' })
  username: string;

  password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
    this.validate();
  }

  private validate(): void {
    this.validateUsername();
    this.validatePassword();
  }

  private validateUsername(): void {
    if (!this.username || this.username.trim().length < 3) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Username must be at least 3 characters long');
    }
  }

  private validatePassword(): void {
    if (!this.password || this.password.length < 8) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Password must be at least 8 characters long');
    }
  }

  // Factory method for creating new users with validation
  static create(data: { username: string; password: string }): User {
    return new User(data.username, data.password);
  }

  // Method to update username with validation
  updateUsername(newUsername: string): void {
    const oldUsername = this.username;
    this.username = newUsername;
    try {
      this.validateUsername();
    } catch (error) {
      this.username = oldUsername; // rollback
      throw error;
    }
  }

  // Method to update password with validation
  updatePassword(newPassword: string): void {
    const oldPassword = this.password;
    this.password = newPassword;
    try {
      this.validatePassword();
    } catch (error) {
      this.password = oldPassword; // rollback
      throw error;
    }
  }
}
