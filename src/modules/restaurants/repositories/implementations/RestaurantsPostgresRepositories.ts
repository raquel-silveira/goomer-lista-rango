import { createConnection } from '../../../../database/connection';
import { ICreateRestaurantDTO } from '../../dtos/ICreateRestaurantDTO';
import { OpeningHours } from '../../infra/postgres/entities/OpeningHours';
import { Restaurant } from '../../infra/postgres/entities/Restaurant';
import { IRestaurantsRepository } from '../IRestaurantRepository';

interface IResponse {
  id: string;
  name: string;
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
    throw new Error('Method not implemented.');
  }
}

export { RestaurantsPostgresRepository };
