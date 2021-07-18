import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';

import { ICreateRestaurantDTO } from '../../dtos/ICreateRestaurantDTO';
import { Restaurant } from '../../infra/postgres/entities/Restaurant';
import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '../IRestaurantRepository';

class RestaurantsRepositoryInMemory implements IRestaurantsRepository {
  restaurants: Restaurant[] = [];

  constructor(private openingHours: OpeningHours[]) {}

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

  async findOne({ id }: { id: string }): Promise<IRestaurantsResponse> {
    const restaurantFound = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    if (!restaurantFound) {
      return null;
    }

    const openingHoursFound = this.openingHours.filter(
      openingHour => openingHour.restaurant_id === id,
    );

    const restaurantOpeningHours = {
      ...restaurantFound,
      opening_hours: { ...openingHoursFound },
    };

    return restaurantOpeningHours;
  }
  async findAll(): Promise<IRestaurantsResponse[]> {
    throw new Error('Method not implemented.');
  }
}

export { RestaurantsRepositoryInMemory };
