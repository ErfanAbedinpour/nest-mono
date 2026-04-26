import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class Blog {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public content: string,
    public userId: number,
    public readonly authorName: string,
    public createdAt: Date,
    public status: BlogStatus,
  ) {
    this.validate();
  }

  private validate(): void {
    this.validateContent();
  }

  private validateContent(): void {
    if (!this.content || this.content.trim().length < 5) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Blog content must be at least 5 characters long');
    }
  }

  // Factory method for creating new blogs with validation
  static create(data: {
    title: string;
    description: string;
    content: string;
    userId: number;
    authorName: string;
    status: BlogStatus;
  }): Blog {
    const blog = new Blog(
      0, // id will be set by database
      data.title,
      data.description,
      data.content,
      data.userId,
      data.authorName,
      new Date(), // createdAt will be set by database
      data.status,
    );
    return blog;
  }

  // Business methods
  canBePublished(): boolean {
    return this.status === BlogStatus.DRAFT &&
           this.title.length > 0 &&
           this.content.length >= 5;
  }

  publish(): void {
    if (!this.canBePublished()) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Blog cannot be published');
    }
    this.status = BlogStatus.PUBLISHED;
  }
}

