export class User {
  constructor(
    private readonly _id: number,
    private readonly _username: string,
    private readonly _password: string,
  ) {}

  static create(data: {
    id?: number;
    username: string;
    password: string;
  }): User {
    return new User(data.id ?? Math.random(), data.username, data.password);
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  static validateUsername(username: string): void {
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
  }

  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }
}
