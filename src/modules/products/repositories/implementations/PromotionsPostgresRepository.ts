import { createConnection } from '@database/connection';
import { ICreatePromotionDTO } from '@modules/products/dtos/ICreatePromotionDTO';
import { IUpdatePromotionDTO } from '@modules/products/dtos/IUpdatePromotionDTO';
import { Promotion } from '@modules/products/infra/postgres/entities/Promotion';

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
      RETURNING DESCRIPTION, PRICE_PROMOTION::FLOAT, TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
      TO_CHAR(FINISH_DATE, 'YYYY-MM-DD') AS FINISH_DATE, TO_CHAR(START_TIME, 'HH24:MI') AS START_TIME,
      TO_CHAR(FINISH_TIME, 'HH24:MI') AS FINISH_TIME`,
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

  async updateByProductId({
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: IUpdatePromotionDTO): Promise<Promotion> {
    const client = await createConnection();

    const { rows } = await client.query(
      `UPDATE PROMOTIONS SET
      DESCRIPTION = $1, PRICE_PROMOTION = $2, START_DATE = $3, FINISH_DATE = $4, START_TIME = $5, FINISH_TIME = $6
      WHERE PRODUCT_ID = $7 RETURNING DESCRIPTION, PRICE_PROMOTION::FLOAT, TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
      TO_CHAR(FINISH_DATE, 'YYYY-MM-DD') AS FINISH_DATE, TO_CHAR(START_TIME, 'HH24:MI') AS START_TIME,
      TO_CHAR(FINISH_TIME, 'HH24:MI') AS FINISH_TIME`,
      [
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

  async findByProductId({
    productId,
  }: {
    productId: string;
  }): Promise<Promotion> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT
      jsonb_build_object(
        'description', PM.DESCRIPTION,
        'price_promotion', PM.PRICE_PROMOTION,
        'start_date', TO_CHAR(PM.START_DATE, 'YYYY-MM-DD'),
        'finish_date', TO_CHAR(PM.FINISH_DATE, 'YYYY-MM-DD'),
        'start_time', TO_CHAR(PM.START_TIME, 'HH24:MI'),
        'finish_time', TO_CHAR(PM.FINISH_TIME, 'HH24:MI')
      ) AS promotion FROM PROMOTIONS PM WHERE PRODUCT_ID = $1`,
      [productId],
    );

    return rows[0].promotion;
  }
}

export { PromotionsPostgresRepository };
