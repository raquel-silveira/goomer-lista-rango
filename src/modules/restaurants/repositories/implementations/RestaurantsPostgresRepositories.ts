import { ICreateRestaurantDTO } from '@modules/restaurants/dtos/ICreateRestaurantDTO';

import { createConnection } from '../../../../database/connection';
import { Restaurant } from '../../infra/postgres/entities/Restaurant';
import { IRestaurantsRepository } from '../IRestaurantRepository';

class RestaurantsPostgresRepository implements IRestaurantsRepository {
  async create({
    id,
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const client = await createConnection();

    const { rows } = await client.query(
      `INSERT INTO RESTAURANTS(ID, NAME, ADDRESS, NUMBER, NEIGHBORHOOD, CITY, STATE, COUNTRY, POSTAL_CODE)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        id,
        name,
        address,
        number,
        neighborhood,
        city,
        state,
        country,
        postal_code,
      ],
    );

    return rows[0];
  }
}

export { RestaurantsPostgresRepository };
