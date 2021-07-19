import { upload } from '@config/upload';
import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';
import { CategoriesPostgresRepository } from '@modules/products/repositories/implementations/CategoriesPostgresRepository';
import { ProductsPostgresRepository } from '@modules/products/repositories/implementations/ProductsPostgresRepository';
import { PromotionsPostgresRepository } from '@modules/products/repositories/implementations/PromotionsPostgresRepository';
import { IProductsRepository } from '@modules/products/repositories/IProductsRepository';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';
import { OpeningHoursPostgresRepository } from '@modules/restaurants/repositories/implementations/OpeningHoursPostgresRepository';
import { RestaurantsPostgresRepository } from '@modules/restaurants/repositories/implementations/RestaurantsPostgresRepositories';
import { IOpeningHoursRepository } from '@modules/restaurants/repositories/IOpeningHoursRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
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

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsPostgresRepository,
);

container.registerSingleton<IPromotionsRepository>(
  'PromotionsRepository',
  PromotionsPostgresRepository,
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesPostgresRepository,
);
