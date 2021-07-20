import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { StorageProviderInMemory } from '@shared/container/providers/StorageProvider/in-memory/StorageProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { UploadPhotoRestaurantUseCase } from './UploadPhotoRestaurantUseCase';

let uploadPhotoRestaurantUseCase: UploadPhotoRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;

describe('Upload Restaurant Photo', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );
    storageProviderInMemory = new StorageProviderInMemory();

    uploadPhotoRestaurantUseCase = new UploadPhotoRestaurantUseCase(
      restaurantsRepositoryInMemory,
      openingHoursRepositoryInMemory,
      storageProviderInMemory,
    );
  });

  it('should be able to upload a restaurant photo', async () => {
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

    const updatedPhotoRestaurant = await uploadPhotoRestaurantUseCase.execute({
      id: restaurant.id,
      photoFilename: 'example.jpg',
    });

    expect(updatedPhotoRestaurant.id).toBe(restaurant.id);
    expect(updatedPhotoRestaurant.photo).toBe('example.jpg');
  });

  it('should delete old photo when updating a new one', async () => {
    const deleteFile = jest.spyOn(storageProviderInMemory, 'deleteFile');

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

    await uploadPhotoRestaurantUseCase.execute({
      id: restaurant.id,
      photoFilename: 'example.jpg',
    });

    await uploadPhotoRestaurantUseCase.execute({
      id: restaurant.id,
      photoFilename: 'example-2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('example.jpg');
  });

  it('should not be able to upload photo without id param', async () => {
    await expect(
      uploadPhotoRestaurantUseCase.execute({
        id: '',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Id is required'));
  });

  it('should not be able to upload photo if id is invalid', async () => {
    await expect(
      uploadPhotoRestaurantUseCase.execute({
        id: 'wrong-id',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to upload photo if no photo', async () => {
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

    await expect(
      uploadPhotoRestaurantUseCase.execute({
        id: restaurant.id,
        photoFilename: '',
      }),
    ).rejects.toEqual(new AppError('Invalid file'));
  });

  it('should not be able to upload photo if restaurant does not exists', async () => {
    await expect(
      uploadPhotoRestaurantUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460541',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
