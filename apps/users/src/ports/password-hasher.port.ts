/**
 * Port interface for password hashing operations
 * This interface defines the contract for password hashing implementations
 * allowing the codebase to remain decoupled from specific hashing implementations
 */
export abstract class PasswordHasher {
  /**
   * Hash a plain text password
   * @param password - The plain text password to hash
   * @returns Promise resolving to the hashed password
   */
  abstract hash(password: string): Promise<string>;

  /**
   * Compare a plain text password with a hashed password
   * @param password - The plain text password
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise resolving to true if passwords match, false otherwise
   */
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
