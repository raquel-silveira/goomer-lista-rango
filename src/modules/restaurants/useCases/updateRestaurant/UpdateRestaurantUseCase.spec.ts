import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { UpdateRestaurantUseCase } from './UpdateRestaurantUseCase';

let updateRestaurantUseCase: UpdateRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Update Restaurant', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    updateRestaurantUseCase = new UpdateRestaurantUseCase(
      restaurantsRepositoryInMemory,
      openingHoursRepositoryInMemory,
    );
  });

  it('should be able to update a restaurant', async () => {
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

    const restaurantUpdated = await updateRestaurantUseCase.execute({
      id: restaurant.id,
      name: 'Restaurante Goomer 2',
      address: 'Rua São João',
      number: '500',
      neighborhood: 'Jardim Tóquio',
      city: 'Sorocaba',
      state: 'SP',
      country: 'Brasil',
      postal_code: '18279-050',
      opening_hours: [
        {
          weekday: 'monday',
          start_time: '08:00',
          finish_time: '14:00',
        },
        {
          weekday: 'saturday',
          start_time: '10:00',
          finish_time: '14:00',
        },
        {
          weekday: 'friday',
          start_time: '08:00',
          finish_time: '15:00',
        },
      ],
    });

    expect(restaurantUpdated.name).toBe('Restaurante Goomer 2');
    expect(restaurantUpdated.opening_hours.length).toBe(7);
  });

  it('should be able to update a restaurant without opening hours', async () => {
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

    const restaurantUpdated = await updateRestaurantUseCase.execute({
      id: restaurant.id,
      name: 'Restaurante Goomer 2',
      address: 'Rua São João',
      number: '500',
      neighborhood: 'Jardim Tóquio',
      city: 'Sorocaba',
      state: 'SP',
      country: 'Brasil',
      postal_code: '18279-050',
    });

    expect(restaurantUpdated.name).toBe('Restaurante Goomer 2');
    expect(restaurantUpdated.opening_hours.length).toBe(7);
  });

  it('should not be able to update a restaurant without the field id', async () => {
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

    await expect(
      updateRestaurantUseCase.execute({
        id: '',
        name: 'Restaurante Goomer 2',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'SP',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'monday',
            start_time: '08:00',
            finish_time: '14:00',
          },
          {
            weekday: 'saturday',
            start_time: '10:00',
            finish_time: '14:00',
          },
          {
            weekday: 'friday',
            start_time: '08:00',
            finish_time: '15:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('Id is required'));
  });

  it('should not be able to update a restaurant without incorrect field id', async () => {
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

    await expect(
      updateRestaurantUseCase.execute({
        id: 'wrong-id',
        name: 'Restaurante Goomer 2',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'SP',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'monday',
            start_time: '08:00',
            finish_time: '14:00',
          },
          {
            weekday: 'saturday',
            start_time: '10:00',
            finish_time: '14:00',
          },
          {
            weekday: 'friday',
            start_time: '08:00',
            finish_time: '15:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to update a restaurant without the field name', async () => {
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
      updateRestaurantUseCase.execute({
        id: restaurant.id,
        name: '',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'SP',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'monday',
            start_time: '08:00',
            finish_time: '14:00',
          },
          {
            weekday: 'saturday',
            start_time: '10:00',
            finish_time: '14:00',
          },
          {
            weekday: 'friday',
            start_time: '08:00',
            finish_time: '15:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('Name is required'));
  });

  it('should not be able to update a restaurant with the length field state different of two', async () => {
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
      updateRestaurantUseCase.execute({
        id: restaurant.id,
        name: 'Restaurante Goomer 2',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'São Paulo',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'monday',
            start_time: '08:00',
            finish_time: '14:00',
          },
          {
            weekday: 'saturday',
            start_time: '10:00',
            finish_time: '14:00',
          },
          {
            weekday: 'friday',
            start_time: '08:00',
            finish_time: '15:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('State field must contain two characters'));
  });

  it('should not be able to update a restaurant if some weekday field is incorrect', async () => {
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
      updateRestaurantUseCase.execute({
        id: restaurant.id,
        name: 'Restaurante Goomer 2',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'SP',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'segunda-feira',
            start_time: '08:00',
            finish_time: '14:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('Weekday is incorrect'));
  });

  it('should not be able to update a restaurant if restaurant not found', async () => {
    await expect(
      updateRestaurantUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460541',
        name: 'Restaurante Goomer 2',
        address: 'Rua São João',
        number: '500',
        neighborhood: 'Jardim Tóquio',
        city: 'Sorocaba',
        state: 'SP',
        country: 'Brasil',
        postal_code: '18279-050',
        opening_hours: [
          {
            weekday: 'monday',
            start_time: '08:00',
            finish_time: '14:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
