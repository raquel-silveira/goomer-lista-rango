import { createConnection } from '@database/connection';
import { ICreateOpeningHoursDTO } from '@modules/restaurants/dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import format from 'pg-format';

import { IOpeningHoursRepository } from '../IOpeningHoursRepository';

class OpeningHoursPostgresRepository implements IOpeningHoursRepository {
  async create(
    opening_hours: ICreateOpeningHoursDTO[],
  ): Promise<OpeningHours[]> {
    const client = await createConnection();

    const formattedOpeningHours = opening_hours.map(openingHour => [
      openingHour.id,
      openingHour.weekday,
      openingHour.start_time,
      openingHour.finish_time,
      openingHour.restaurant_id,
    ]);

    const { rows } = await client.query(
      format(
        `INSERT INTO OPENING_HOURS(ID, WEEKDAY, START_TIME, FINISH_TIME, RESTAURANT_ID)
        VALUES %L RETURNING WEEKDAY, TO_CHAR(START_TIME, 'HH24:MI') AS START_TIME, TO_CHAR(FINISH_TIME, 'HH24:MI') AS FINISH_TIME`,
        formattedOpeningHours,
      ),
    );

    return rows;
  }

  async deleteByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<void> {
    const client = await createConnection();

    await client.query(`DELETE FROM OPENING_HOURS WHERE RESTAURANT_ID = $1`, [
      restaurantId,
    ]);
  }

  async findByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<OpeningHours[]> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT WEEKDAY, TO_CHAR(START_TIME, 'HH24:MI') AS START_TIME, TO_CHAR(FINISH_TIME, 'HH24:MI') AS FINISH_TIME
      FROM OPENING_HOURS WHERE RESTAURANT_ID = $1`,
      [restaurantId],
    );

    return rows;
  }
}

export { OpeningHoursPostgresRepository };
