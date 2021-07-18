import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IOpeningHours {
  weekday: string;
  start_time: string;
  finish_time: string;
}

interface IRequest {
  id: string;
}

interface IResponse {
  id: string;
  name: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  opening_hours: IOpeningHours[];
}

@injectable()
class ListOneRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantRepository: IRestaurantsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

    const restaurant = await this.restaurantRepository.findOne({ id });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    return restaurant;
  }
}

export { ListOneRestaurantUseCase };
