import {
  IProductsRepository,
  IProductsResponse,
} from '@modules/products/repositories/IProductsRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  restaurantId: string;
}

@injectable()
class ListAllRestaurantProductsUseCase {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  async execute({ restaurantId }: IRequest): Promise<IProductsResponse[]> {
    if (!restaurantId) {
      throw new AppError('Restaurant id is required');
    }

    if (!validate(restaurantId) || version(restaurantId) !== 4) {
      throw new AppError('Invalid restaurant id');
    }

    const restaurantFound = await this.restaurantsRepository.findOne({
      id: restaurantId,
    });

    if (!restaurantFound) {
      throw new AppError('Restaurant not found');
    }

    const products = await this.productsRepository.findByRestaurantId({
      restaurantId,
    });

    return products;
  }
}

export { ListAllRestaurantProductsUseCase };
