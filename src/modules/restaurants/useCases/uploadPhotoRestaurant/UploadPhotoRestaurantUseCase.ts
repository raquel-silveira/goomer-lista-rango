import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  photoFilename?: string;
}

@injectable()
class UploadPhotoRestaurantUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('OpeningHoursRepository')
    private openingHoursRepository: IOpeningHoursRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    id,
    photoFilename,
  }: IRequest): Promise<IRestaurantsResponse> {
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

    if (!photoFilename) {
      throw new AppError('Invalid file');
    }

    const restaurant = await this.restaurantsRepository.findOne({ id });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    if (restaurant.photo) {
      await this.storageProvider.deleteFile(restaurant.photo);
    }

    const storagePhotoFilename = await this.storageProvider.saveFile(
      photoFilename,
    );

    const restaurantPhotoUpdated =
      await this.restaurantsRepository.updatePhotoById({
        id,
        photoFilename: storagePhotoFilename,
      });

    const openingHoursListed =
      await this.openingHoursRepository.findByRestaurantId({
        restaurantId: id,
      });

    const restaurantOpeningHoursUpdated = {
      ...restaurantPhotoUpdated,
      opening_hours: openingHoursListed,
    };

    return restaurantOpeningHoursUpdated;
  }
}

export { UploadPhotoRestaurantUseCase };
