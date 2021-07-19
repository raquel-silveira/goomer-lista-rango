import { ICreateRestaurantDTO } from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import { IUpdateRestaurantDTO } from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import { Restaurant } from '@modules/restaurants/infra/postgres/entities/Restaurant';
import { createConnection } from 'database/connection';

import { IRestaurantsRepository } from '../IRestaurantsRepository';

interface IResponse {
  id: string;
  name: string;
  photo: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  opening_hours: OpeningHours[];
}

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

  async findOne({ id }: { id: string }): Promise<IResponse> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT R.*,
      jsonb_agg(
        DISTINCT
        jsonb_build_object(
          'weekday', OH.WEEKDAY,
          'start_time', OH.START_TIME,
          'finish_time', OH.FINISH_TIME
        )
      ) as opening_hours
      FROM RESTAURANTS R INNER JOIN OPENING_HOURS OH ON R.ID = OH.RESTAURANT_ID WHERE R.ID = $1 GROUP BY R.ID`,
      [id],
    );

    return rows[0];
  }
  async findAll(): Promise<IResponse[]> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT R.*,
      jsonb_agg(
        DISTINCT
        jsonb_build_object(
          'weekday', OH.WEEKDAY,
          'start_time', OH.START_TIME,
          'finish_time', OH.FINISH_TIME
        )
      ) as opening_hours
      FROM RESTAURANTS R INNER JOIN OPENING_HOURS OH ON R.ID = OH.RESTAURANT_ID GROUP BY R.ID`,
    );

    return rows;
  }

  async updateById({
    id,
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const client = await createConnection();

    const { rows } = await client.query(
      `UPDATE RESTAURANTS SET
      NAME = $1, ADDRESS = $2, NUMBER = $3, NEIGHBORHOOD = $4, CITY = $5, STATE = $6, COUNTRY = $7, POSTAL_CODE = $8
      WHERE ID = $9 RETURNING *`,
      [
        name,
        address,
        number,
        neighborhood,
        city,
        state,
        country,
        postal_code,
        id,
      ],
    );

    return rows[0];
  }

  async delete({ id }: { id: string }): Promise<void> {
    const client = await createConnection();

    await client.query(`DELETE FROM RESTAURANTS WHERE ID = $1`, [id]);
  }

  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Restaurant> {
    const client = await createConnection();

    const { rows } = await client.query(
      `UPDATE RESTAURANTS SET PHOTO = $1 WHERE ID = $2 RETURNING *`,
      [photoFilename, id],
    );

    return rows[0];
  }
}

export { RestaurantsPostgresRepository };
