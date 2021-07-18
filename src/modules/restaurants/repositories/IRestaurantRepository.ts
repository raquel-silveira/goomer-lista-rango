import { ICreateRestaurantDTO } from '../dtos/ICreateRestaurantDTO';
import { OpeningHours } from '../infra/postgres/entities/OpeningHours';
import { Restaurant } from '../infra/postgres/entities/Restaurant';

interface IRestaurantsResponse {
  id: string;
  name: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  opening_hours: OpeningHours[];
}

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

  findOne({ id }: { id: string }): Promise<IRestaurantsResponse>;

  findAll(): Promise<IRestaurantsResponse[]>;
}

export { IRestaurantsRepository, IRestaurantsResponse };
