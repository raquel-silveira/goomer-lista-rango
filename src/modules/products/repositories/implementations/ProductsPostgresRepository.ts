import { ICreateProductDTO } from '@modules/products/dtos/ICreateProductDTO';
import { IUpdateProductDTO } from '@modules/products/dtos/IUpdateProductDTO';
import { Product } from '@modules/products/infra/postgres/entities/Product';
import { createConnection } from 'database/connection';

import { IProductsRepository, IProductsResponse } from '../IProductsRepository';

class ProductsPostgresRepository implements IProductsRepository {
  async create({
    id,
    name,
    price,
    category_id,
    restaurantId,
  }: ICreateProductDTO): Promise<Product> {
    const client = await createConnection();

    const { rows } = await client.query(
      `INSERT INTO PRODUCTS(ID, NAME, PRICE, CATEGORY_ID, RESTAURANT_ID) VALUES($1, $2, $3, $4, $5)
      RETURNING ID, NAME, PRICE::FLOAT`,
      [id, name, price, category_id, restaurantId],
    );

    return rows[0];
  }
  async findByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IProductsResponse[]> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT P.ID, P.NAME, P.PHOTO, P.PRICE::FLOAT, C.NAME as category,
      jsonb_build_object(
        'description', PM.DESCRIPTION,
        'price_promotion', PM.PRICE_PROMOTION,
        'start_date', PM.START_DATE,
        'finish_date', PM.FINISH_DATE,
        'start_time', PM.FINISH_TIME,
        'finish_time', PM.FINISH_TIME
      ) AS promotion
      FROM PRODUCTS P INNER JOIN PROMOTIONS PM ON P.ID = PM.PRODUCT_ID
      LEFT JOIN CATEGORIES C ON P.CATEGORY_ID = C.ID WHERE P.RESTAURANT_ID = $1`,
      [restaurantId],
    );

    return rows;
  }

  async findOne({ id }: { id: string }): Promise<IProductsResponse> {
    const client = await createConnection();

    const { rows } = await client.query(
      `SElECT P.ID, P.NAME, P.PHOTO, P.PRICE::FLOAT, C.NAME as category,
      jsonb_build_object(
        'description', PM.DESCRIPTION,
        'price_promotion', PM.PRICE_PROMOTION,
        'start_date', PM.START_DATE,
        'finish_date', PM.FINISH_DATE,
        'start_time', PM.FINISH_TIME,
        'finish_time', PM.FINISH_TIME
      ) AS promotion
      FROM PRODUCTS P INNER JOIN PROMOTIONS PM ON P.ID = PM.PRODUCT_ID
      LEFT JOIN CATEGORIES C ON P.CATEGORY_ID = C.ID WHERE P.ID = $1`,
      [id],
    );

    return rows[0];
  }

  async updateById({
    id,
    name,
    price,
    category_id,
  }: IUpdateProductDTO): Promise<Product> {
    const client = await createConnection();

    const { rows } = await client.query(
      `UPDATE PRODUCTS SET
      NAME = $1, PRICE = $2, CATEGORY_ID = $3 WHERE ID = $4 RETURNING ID, NAME, PRICE::FLOAT, PHOTO`,
      [name, price, category_id, id],
    );

    return rows[0];
  }
  async delete({ id }: { id: string }): Promise<void> {
    const client = await createConnection();

    await client.query(`DELETE FROM PRODUCTS WHERE ID = $1`, [id]);
  }
  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Product> {
    const client = await createConnection();

    const { rows } = await client.query(
      `UPDATE PRODUCTS SET PHOTO = $1 WHERE ID = $2 RETURNING ID, NAME, PHOTO, PRICE::FLOAT, CATEGORY_ID`,
      [photoFilename, id],
    );

    return rows[0];
  }
}

export { ProductsPostgresRepository };
