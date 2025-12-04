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
  ) {}
}
