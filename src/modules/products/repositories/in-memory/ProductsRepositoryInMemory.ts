import { ICreateProductDTO } from '@modules/products/dtos/ICreateProductDTO';
import { IUpdateProductDTO } from '@modules/products/dtos/IUpdateProductDTO';
import { Product } from '@modules/products/infra/postgres/entities/Product';

import { IProductsRepository, IProductsResponse } from '../IProductsRepository';

class ProductsRepositoryInMemory implements IProductsRepository {
  products: Product[] = [];

  async create({
    id,
    name,
    price,
    category_id,
    restaurantId,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id,
      name,
      price,
      category_id,
      restaurantId,
    });

    this.products.push(product);

    return product;
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

export { ProductsRepositoryInMemory };
