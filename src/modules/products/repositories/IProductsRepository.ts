import { ICreateProductDTO } from '../dtos/ICreateProductDTO';
import { IUpdateProductDTO } from '../dtos/IUpdateProductDTO';
import { Product } from '../infra/postgres/entities/Product';
import { Promotion } from '../infra/postgres/entities/Promotion';

interface IProductsResponse {
  id: string;
  name: string;
  photo: string;
  price: number;
  category: string;
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

  findOne({ id }: { id: string }): Promise<IProductsResponse>;

  findByRestaurantId({
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
