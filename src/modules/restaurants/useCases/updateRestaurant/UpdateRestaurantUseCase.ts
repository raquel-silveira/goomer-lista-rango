import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';
import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantsRepository';
import { differenceInMinutes } from 'date-fns';
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
    private restaurantsRepository: IRestaurantsRepository,

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

    if (state && state.length !== 2) {
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

      if (
        (openingHour.start_time && !openingHour.finish_time) ||
        (openingHour.finish_time && !openingHour.start_time)
      ) {
        throw new AppError('Hour field is missing');
      }

      if (openingHour.start_time && openingHour.finish_time) {
        if (
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(openingHour.start_time) ||
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(openingHour.finish_time)
        ) {
          throw new AppError('Hour format invalid');
        }

        const startTime = openingHour.start_time.split(':');
        const finishTime = openingHour.finish_time.split(':');

        const fullDate = new Date();

        const year = fullDate.getFullYear();
        const month = fullDate.getMonth();
        const day = fullDate.getDate();

        const dateStartTime = new Date(
          year,
          month,
          day,
          Number(startTime[0]),
          Number(startTime[1]),
        );
        const dateFinishTime = new Date(
          year,
          month,
          day,
          Number(finishTime[0]),
          Number(finishTime[1]),
        );

        if (dateStartTime > dateFinishTime) {
          throw new AppError(
            'Start time does not can be greater then finish time',
          );
        }

        const minutesDifference = differenceInMinutes(
          dateFinishTime,
          dateStartTime,
        );

        if (minutesDifference < 15) {
          throw new AppError(
            'Times must have a minimum interval of 15 minutes',
          );
        }
      }
    });

    const restaurant = await this.restaurantsRepository.findOne({ id });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    const updatedRestaurant = await this.restaurantsRepository.updateById({
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
        start_time: start_time || null,
        finish_time: finish_time || null,
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
