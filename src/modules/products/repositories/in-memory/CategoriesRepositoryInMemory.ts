import { Category } from '@modules/products/infra/postgres/entities/Category';

import { ICategoriesRepository } from '../ICategoriesRepository';

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async create({
    id,
    name,
    restaurantId,
  }: {
    id: string;
    name: string;
    restaurantId: string;
  }): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      id,
      name,
      restaurantId,
    });

    this.categories.push(category);

    return category;
  }

  async findByName(name: string): Promise<Category> {
    const categoryFound = this.categories.find(
      category => category.name === name,
    );

    if (!categoryFound) {
      return null;
    }

    return categoryFound;
  }
}

export { CategoriesRepositoryInMemory };
