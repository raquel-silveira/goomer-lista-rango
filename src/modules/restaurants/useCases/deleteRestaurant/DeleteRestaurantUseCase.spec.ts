import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { StorageProviderInMemory } from '@shared/container/providers/StorageProvider/in-memory/StorageProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { DeleteRestaurantUseCase } from './DeleteRestaurantUseCase';

let deleteRestaurantUseCase: DeleteRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;

describe('Delete Restaurant', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );
    storageProviderInMemory = new StorageProviderInMemory();

    deleteRestaurantUseCase = new DeleteRestaurantUseCase(
      restaurantsRepositoryInMemory,
      storageProviderInMemory,
    );
  });

  it('should be able to delete a restaurant by id', async () => {
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

    await restaurantsRepositoryInMemory.updatePhotoById({
      id: restaurant.id,
      photoFilename: 'image.jpg',
    });

    await expect(
      deleteRestaurantUseCase.execute({
        id: restaurant.id as string,
      }),
    ).resolves.not.toThrow();
  });

  it('should not be able to delete without id param', async () => {
    await expect(deleteRestaurantUseCase.execute({ id: '' })).rejects.toEqual(
      new AppError('Id is required'),
    );
  });

  it('should not be able to delete if id is invalid', async () => {
    await expect(
      deleteRestaurantUseCase.execute({ id: 'wrong-id' }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to delete if restaurant does not exists', async () => {
    await expect(
      deleteRestaurantUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460541',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
