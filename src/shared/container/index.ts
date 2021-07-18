import { container } from 'tsyringe';

import { OpeningHoursPostgresRepository } from '../../modules/restaurants/repositories/implementations/OpeningHoursPostgresRepository';
import { RestaurantsPostgresRepository } from '../../modules/restaurants/repositories/implementations/RestaurantsPostgresRepositories';
import { IOpeningHoursRepository } from '../../modules/restaurants/repositories/IOpeningHoursRepository';
import { IRestaurantsRepository } from '../../modules/restaurants/repositories/IRestaurantRepository';

container.registerSingleton<IRestaurantsRepository>(
  'RestaurantsRepository',
  RestaurantsPostgresRepository,
);

container.registerSingleton<IOpeningHoursRepository>(
  'OpeningHoursRepository',
  OpeningHoursPostgresRepository,
);
