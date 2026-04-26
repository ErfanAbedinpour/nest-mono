import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

export class Comment {
  constructor(
    public id: number,
    public content: string,
    public blogId: number,
    public userId: number,
    public authorUsername: string,
    public createdAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    this.validateContent();
  }

  private validateContent(): void {
    if (!this.content || this.content.trim().length < 5) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Comment content must be at least 5 characters long');
    }
  }

  // Factory method for creating new comments with validation
  static create(data: {
    content: string;
    blogId: number;
    userId: number;
    authorUsername: string;
  }): Comment {
    const comment = new Comment(
      0, // id will be set by database
      data.content,
      data.blogId,
      data.userId,
      data.authorUsername,
      new Date(), // createdAt will be set by database
    );
    return comment;
  }
}
