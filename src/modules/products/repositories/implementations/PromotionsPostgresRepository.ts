import { ICreatePromotionDTO } from '@modules/products/dtos/ICreatePromotionDTO';
import { Promotion } from '@modules/products/infra/postgres/entities/Promotion';
import { createConnection } from 'database/connection';

import { IPromotionsRepository } from '../IPromotionsRepository';

class PromotionsPostgresRepository implements IPromotionsRepository {
  async create({
    id,
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: ICreatePromotionDTO): Promise<Promotion> {
    const client = await createConnection();

    const { rows } = await client.query(
      `INSERT INTO PROMOTIONS
      (ID, DESCRIPTION, PRICE_PROMOTION, START_DATE, FINISH_DATE, START_TIME, FINISH_TIME, PRODUCT_ID)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING DESCRIPTION, PRICE_PROMOTION, START_DATE, FINISH_DATE, START_TIME, FINISH_TIME`,
      [
        id,
        description,
        price_promotion,
        start_date,
        finish_date,
        start_time,
        finish_time,
        product_id,
      ],
    );

    return rows[0];
  }
}

export { PromotionsPostgresRepository };
