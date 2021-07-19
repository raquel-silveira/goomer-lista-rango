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
      RETURNING ID, NAME, PRICE`,
      [id, name, price, category_id, restaurantId],
    );

    return rows[0];
  }
  async findAll({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IProductsResponse[]> {
    throw new Error('Method not implemented.');
  }
  async updateById({ id, name, price }: IUpdateProductDTO): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  async delete({ id }: { id: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}

export { ProductsPostgresRepository };
