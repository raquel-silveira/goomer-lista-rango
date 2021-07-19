import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { ListOneRestaurantUseCase } from './ListOneRestaurantUseCase';

let listOneRestaurantUseCase: ListOneRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('List One Restaurant', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    listOneRestaurantUseCase = new ListOneRestaurantUseCase(
      restaurantsRepositoryInMemory,
    );
  });

  it('should be able to list a restaurant by id', async () => {
    const restaurant = await restaurantsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460541',
      name: 'Restaurante Goomer',
      address: 'Rua São João',
      number: '500',
      neighborhood: 'Jardim Tóquio',
      city: 'Sorocaba',
      state: 'SP',
      country: 'Brasil',
      postal_code: '18279-050',
    });

    const listedRestaurant = await listOneRestaurantUseCase.execute({
      id: restaurant.id as string,
    });

    expect(listedRestaurant).toHaveProperty('id');
  });

  it('should not be able to list without id param', async () => {
    await expect(listOneRestaurantUseCase.execute({ id: '' })).rejects.toEqual(
      new AppError('Id is required'),
    );
  });

  it('should not be able to list if id is invalid', async () => {
    await expect(
      listOneRestaurantUseCase.execute({ id: 'wrong-id' }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to list if restaurant does not exists', async () => {
    await expect(
      listOneRestaurantUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460541',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
