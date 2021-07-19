import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
class ListOneRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantRepository: IRestaurantsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IRestaurantsResponse> {
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
