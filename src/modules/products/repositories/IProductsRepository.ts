import { ICreateProductDTO } from '../dtos/ICreateProductDTO';
import { IUpdateProductDTO } from '../dtos/IUpdateProductDTO';
import { Product } from '../infra/postgres/entities/Product';
import { Promotion } from '../infra/postgres/entities/Promotion';

interface IProductsResponse {
  id: string;
  name: string;
  photo: string;
  price: number;
  category_id: string;
  restaurant_id: string;
  promotion: Promotion;
}

interface IProductsRepository {
  create({
    id,
    name,
    price,
    category_id,
    restaurantId,
  }: ICreateProductDTO): Promise<Product>;

  findAll({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IProductsResponse[]>;

  updateById({ id, name, price }: IUpdateProductDTO): Promise<Product>;

  delete({ id }: { id: string }): Promise<void>;

  updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Product>;
}

export { IProductsRepository, IProductsResponse };
