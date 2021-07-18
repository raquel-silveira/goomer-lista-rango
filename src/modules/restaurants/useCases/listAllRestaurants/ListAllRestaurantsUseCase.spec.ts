import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { ListAllRestaurantsUseCase } from './ListAllRestaurantsUseCase';

let listAllRestaurantUseCase: ListAllRestaurantsUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('List Restaurant', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    listAllRestaurantUseCase = new ListAllRestaurantsUseCase(
      restaurantsRepositoryInMemory,
    );
  });

  it('should be able to list all restaurants', async () => {
    await restaurantsRepositoryInMemory.create({
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

    await restaurantsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Restaurante Goomer 2',
      address: 'Rua São João',
      number: '500',
      neighborhood: 'Jardim Tóquio',
      city: 'Sorocaba',
      state: 'SP',
      country: 'Brasil',
      postal_code: '18279-050',
    });

    const listedRestaurants = await listAllRestaurantUseCase.execute();

    expect(listedRestaurants.length).toBe(2);
    expect(listedRestaurants[0].name).toBe('Restaurante Goomer');
    expect(listedRestaurants[1].name).toBe('Restaurante Goomer 2');
  });

  it('should be able to list an empty array if there is no restaurant', async () => {
    const restaurants = await listAllRestaurantUseCase.execute();

    expect(restaurants).toStrictEqual([]);
  });
});
