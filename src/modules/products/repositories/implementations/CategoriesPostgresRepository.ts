import { Category } from '@modules/products/infra/postgres/entities/Category';
import { createConnection } from 'database/connection';

import { ICategoriesRepository } from '../ICategoriesRepository';

class CategoriesPostgresRepository implements ICategoriesRepository {
  async create({
    id,
    name,
    restaurantId,
  }: {
    id: string;
    name: string;
    restaurantId: string;
  }): Promise<Category> {
    const client = await createConnection();

    const { rows } = await client.query(
      `INSERT INTO CATEGORIES(ID, NAME, RESTAURANT_ID) VALUES($1, $2, $3) RETURNING ID, NAME`,
      [id, name, restaurantId],
    );

    return rows[0];
  }

  async findByName(name: string): Promise<Category> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT ID, NAME FROM CATEGORIES WHERE NAME = $1`,
      [name],
    );

    return rows[0];
  }

  async findById(id: string): Promise<Category> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT NAME FROM CATEGORIES WHERE ID = $1`,
      [id],
    );

    return rows[0];
  }
}

export { CategoriesPostgresRepository };
