import { ICreateRestaurantDTO } from '@modules/restaurants/dtos/ICreateRestaurantDTO';

import { Restaurant } from '../../infra/postgres/entities/Restaurant';
import { IRestaurantsRepository } from '../IRestaurantRepository';

class RestaurantsRepositoryInMemory implements IRestaurantsRepository {
  restaurants: Restaurant[] = [];

  async create({
    id,
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, {
      id,
      name,
      address,
      number,
      neighborhood,
      city,
      state,
      country,
      postal_code,
    });

    this.restaurants.push(restaurant);

    return restaurant;
  }
}

export { RestaurantsRepositoryInMemory };
