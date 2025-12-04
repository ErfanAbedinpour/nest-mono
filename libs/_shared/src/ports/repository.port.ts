import { Entity } from '../global/entity';

export abstract class Repository<T extends Entity> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract create(entity: T): Promise<T>;
}
