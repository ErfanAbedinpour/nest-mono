export class FindAllBlogsQuery {
  constructor(
    public readonly skip: number,
    public readonly take: number,
  ) {}
}
