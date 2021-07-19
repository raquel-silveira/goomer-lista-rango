import { ICreateRestaurantDTO } from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import { IUpdateRestaurantDTO } from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import { Restaurant } from '@modules/restaurants/infra/postgres/entities/Restaurant';

import { IRestaurantsRepository } from '../IRestaurantRepository';

interface IResponse {
  id: string;
  name: string;
  photo: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  opening_hours: OpeningHours[];
}

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

  async findOne({ id }: { id: string }): Promise<IResponse> {
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
  async findAll(): Promise<IResponse[]> {
    const restaurants = this.restaurants.map(restaurant => ({
      ...restaurant,
      opening_hours: this.openingHours.filter(
        openingHour => openingHour.restaurant_id === restaurant.id,
      ),
    }));

    return restaurants;
  }

  async updateById({
    id,
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurantFound = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    if (!restaurantFound) {
      return null;
    }

    const updatedFields = {
      ...(name ? { name } : {}),
      ...(address ? { address } : {}),
      ...(number ? { number } : {}),
      ...(neighborhood ? { neighborhood } : {}),
      ...(city ? { city } : {}),
      ...(state ? { state } : {}),
      ...(country ? { country } : {}),
      ...(postal_code ? { postal_code } : {}),
    };

    const restaurantIndex = this.restaurants.findIndex(
      restaurant => restaurant.id === id,
    );

    this.restaurants[restaurantIndex] = {
      ...this.restaurants[restaurantIndex],
      ...updatedFields,
    };

    const updatedRestaurant = { ...this.restaurants[restaurantIndex] };

    return updatedRestaurant;
  }

  async delete({ id }: { id: string }): Promise<void> {
    this.restaurants = this.restaurants.filter(
      restaurant => restaurant.id !== id,
    );
  }

  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Restaurant> {
    const restaurantFound = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    if (!restaurantFound) {
      return null;
    }

    const restaurantIndex = this.restaurants.findIndex(
      restaurant => restaurant.id === id,
    );

    this.restaurants[restaurantIndex].photo = photoFilename;

    const updatedPhotoRestaurant = { ...this.restaurants[restaurantIndex] };

    return updatedPhotoRestaurant;
  }
}

export { RestaurantsRepositoryInMemory };
