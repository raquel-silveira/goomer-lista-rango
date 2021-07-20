import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
class DeleteRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

    const restaurant = await this.restaurantsRepository.findOne({ id });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    if (restaurant.photo) {
      await this.storageProvider.deleteFile(restaurant.photo);
    }

    await this.restaurantsRepository.delete({ id });
  }
}

export { DeleteRestaurantUseCase };
