import { upload } from '@config/upload';
import { OpeningHoursPostgresRepository } from '@modules/restaurants/repositories/implementations/OpeningHoursPostgresRepository';
import { RestaurantsPostgresRepository } from '@modules/restaurants/repositories/implementations/RestaurantsPostgresRepositories';
import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantRepository';
import { container } from 'tsyringe';

import { LocalStorageProvider } from './providers/StorageProvider/implementations/LocalStorageProvider';
import { IStorageProvider } from './providers/StorageProvider/IStorageProvider';

const storageProviders = {
  local: LocalStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviders[upload.driver],
);

container.registerSingleton<IRestaurantsRepository>(
  'RestaurantsRepository',
  RestaurantsPostgresRepository,
);

container.registerSingleton<IOpeningHoursRepository>(
  'OpeningHoursRepository',
  OpeningHoursPostgresRepository,
);
