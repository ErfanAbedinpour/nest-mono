import { ApiProperty } from '@nestjs/swagger';
import { Entity } from '@app/_shared/global/entity';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

export class User extends Entity {
  @ApiProperty({ type: 'string', example: 'john_doe' })
  username: string;

  password: string; // This will contain the hashed password

  constructor(username: string, hashedPassword: string) {
    super();
    this.username = username;
    this.password = hashedPassword;
    this.validateUsername();
  }

  private validateUsername(): void {
    if (!this.username || this.username.trim().length < 3) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Username must be at least 3 characters long');
    }
  }

  /**
   * Validates a plain text password (used during user creation)
   * This is a static method for validation purposes before hashing
   */
  static validatePlainPassword(password: string): void {
    if (!password || password.length < 8) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Password must be at least 8 characters long');
    }
  }

  /**
   * Factory method for creating new users with validation
   * @param data - Must contain plain text password, will be validated here
   * @param hashedPassword - The already hashed password from the PasswordHasher service
   */
  static create(data: {
    username: string;
    password: string;
    hashedPassword: string;
  }): User {
    // Validate the plain password before it was hashed
    this.validatePlainPassword(data.password);
    // Create user with the hashed password
    return new User(data.username, data.hashedPassword);
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

  /**
   * Method to update password - receives already hashed password
   * @param plainPassword - The plain password for validation purposes
   * @param hashedPassword - The hashed password to store
   */
  updatePassword(plainPassword: string, hashedPassword: string): void {
    // Validate the plain password before storing the hashed version
    User.validatePlainPassword(plainPassword);
    this.password = hashedPassword;
  }
}
