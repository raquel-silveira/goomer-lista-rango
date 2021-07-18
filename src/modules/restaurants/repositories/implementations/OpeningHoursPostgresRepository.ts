import format from 'pg-format';

import { createConnection } from '../../../../database/connection';
import { ICreateOpeningHoursDTO } from '../../dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '../../infra/postgres/entities/OpeningHours';
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
        VALUES %L RETURNING WEEKDAY, START_TIME, FINISH_TIME`,
        formattedOpeningHours,
      ),
    );

    return rows;
  }

  async delete({ restaurantId }: { restaurantId: string }): Promise<void> {
    const client = await createConnection();

    await client.query(`DELETE FROM OPENING_HOURS WHERE RESTAURANT_ID = $1`, [
      restaurantId,
    ]);
  }
}

export { OpeningHoursPostgresRepository };
