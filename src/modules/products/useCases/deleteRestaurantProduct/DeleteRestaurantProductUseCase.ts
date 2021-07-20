import { IProductsRepository } from '@modules/products/repositories/IProductsRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  restaurantId: string;
}

@injectable()
class DeleteRestaurantProductUseCase {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  async execute({ id, restaurantId }: IRequest): Promise<void> {
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

    if (!restaurantId) {
      throw new AppError('Restaurant id is required');
    }

    if (!validate(restaurantId) || version(restaurantId) !== 4) {
      throw new AppError('Invalid restaurant id');
    }

    const restaurant = await this.restaurantsRepository.findOne({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    const product = await this.productsRepository.findOne({ id });

    if (!product) {
      throw new AppError('Product not found');
    }

    await this.productsRepository.delete({ id });
  }
}

export { DeleteRestaurantProductUseCase };
