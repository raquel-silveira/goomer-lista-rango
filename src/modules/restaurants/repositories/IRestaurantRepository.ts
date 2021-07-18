import { ICreateRestaurantDTO } from '../dtos/ICreateRestaurantDTO';
import { Restaurant } from '../infra/postgres/entities/Restaurant';

interface IRestaurantsRepository {
  create({
    id,
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
  }: ICreateRestaurantDTO): Promise<Restaurant>;
}

export { IRestaurantsRepository };
