import { Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';
import { PasswordHasher } from '../../../ports/password-hasher.port';

const pbkdf2Async = promisify(pbkdf2);

/**
 * Implementation of PasswordHasher using Node.js built-in crypto module
 * Uses PBKDF2 algorithm with SHA-256 for secure password hashing
 */
@Injectable()
export class CryptoPasswordHasher implements PasswordHasher {
  private readonly ITERATIONS = 100000;
  private readonly DIGEST = 'sha256';
  private readonly SALT_LENGTH = 32;
  private readonly KEY_LENGTH = 64;

  /**
   * Hash a plain text password using PBKDF2
   * The returned hash includes the salt for later comparison
   * Format: salt:hash
   */
  async hash(password: string): Promise<string> {
    const salt = randomBytes(this.SALT_LENGTH).toString('hex');
    const hash = (await pbkdf2Async(
      password,
      salt,
      this.ITERATIONS,
      this.KEY_LENGTH,
      this.DIGEST,
    )) as Buffer;

    return `${salt}:${hash.toString('hex')}`;
  }

  /**
   * Compare a plain text password with a hashed password
   * Extracts the salt from the stored hash and recomputes the hash for comparison
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [salt, hash] = hashedPassword.split(':');

      if (!salt || !hash) {
        return false;
      }

      const computedHash = (await pbkdf2Async(
        password,
        salt,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.DIGEST,
      )) as Buffer;

      return hash === computedHash.toString('hex');
    } catch {
      return false;
    }
  }
}
