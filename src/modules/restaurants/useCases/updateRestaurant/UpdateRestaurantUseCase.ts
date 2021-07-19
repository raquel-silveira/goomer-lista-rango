import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IOpeningHours {
  weekday: string;
  start_time?: string;
  finish_time?: string;
}

interface IRequest {
  id: string;
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
class UpdateRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantRepository: IRestaurantsRepository,

    @inject('OpeningHoursRepository')
    private openingHoursRepository: IOpeningHoursRepository,
  ) {}

  async execute({
    id,
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
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

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

    const restaurant = await this.restaurantRepository.findOne({ id });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    const updatedRestaurant = await this.restaurantRepository.updateById({
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

    await this.openingHoursRepository.deleteByRestaurantId({
      restaurantId: id,
    });

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
        restaurant_id: id,
      };
    });

    const openingHoursCreated = await this.openingHoursRepository.create(
      openingHoursWeekdays,
    );

    const restaurantOpeningHoursUpdated = {
      ...updatedRestaurant,
      opening_hours: openingHoursCreated,
    };

    return restaurantOpeningHoursUpdated;
  }
}

export { UpdateRestaurantUseCase };
