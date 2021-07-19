import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import { Restaurant } from '@modules/restaurants/infra/postgres/entities/Restaurant';
import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

interface IOpeningHours {
  weekday: string;
  start_time?: string;
  finish_time?: string;
}

interface IRequest {
  name: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  opening_hours?: IOpeningHours[];
}

@injectable()
class CreateRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantRepository: IRestaurantsRepository,

    @inject('OpeningHoursRepository')
    private openingHoursRepository: IOpeningHoursRepository,
  ) {}

  async execute({
    name,
    address,
    number,
    neighborhood,
    city,
    state,
    country,
    postal_code,
    opening_hours = [],
  }: IRequest): Promise<IRestaurantsResponse> {
    if (!name) {
      throw new AppError('Name is required');
    }

    if (state.length !== 2) {
      throw new AppError('State field must contain two characters');
    }

    const weekdays: string[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    opening_hours.forEach(openingHour => {
      if (!weekdays.includes(openingHour.weekday)) {
        throw new AppError('Weekday is incorrect');
      }
    });

    const restaurant = {
      ...new Restaurant(),
      name,
      address,
      number,
      neighborhood,
      city,
      state,
      country,
      postal_code,
    };

    const restaurantCreated = await this.restaurantRepository.create(
      restaurant,
    );

    const openingHoursWeekdays = weekdays.map(weekday => {
      const foundOpeningHour = opening_hours.find(
        weekdayOpeningHour => weekday === weekdayOpeningHour.weekday,
      );

      let start_time: string | null = null;
      let finish_time: string | null = null;

      if (foundOpeningHour) {
        start_time = foundOpeningHour.start_time;
        finish_time = foundOpeningHour.finish_time;
      }

      return {
        ...new OpeningHours(),
        weekday,
        start_time,
        finish_time,
        restaurant_id: restaurantCreated.id,
      };
    });

    const openingHoursCreated = await this.openingHoursRepository.create(
      openingHoursWeekdays,
    );

    const restaurantOpeningHoursCreated = {
      ...restaurantCreated,
      opening_hours: openingHoursCreated,
    };

    return restaurantOpeningHoursCreated;
  }
}

export { CreateRestaurantUseCase };
