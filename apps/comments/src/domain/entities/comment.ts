export class Comment {
  constructor(
    public id: number,
    public content: string,
    public blogId: number,
    public userId: number,
    public authorUsername: string,
    public createdAt: Date,
  ) {}
}
