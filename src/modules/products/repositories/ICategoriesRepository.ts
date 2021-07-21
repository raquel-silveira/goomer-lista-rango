import { Category } from '../infra/postgres/entities/Category';

interface ICategoriesRepository {
  create({
    id,
    name,
    restaurantId,
  }: {
    id: string;
    name: string;
    restaurantId: string;
  }): Promise<Category>;

  findByName(name: string): Promise<Category>;

  findById(id: string): Promise<Category>;
}

export { ICategoriesRepository };
