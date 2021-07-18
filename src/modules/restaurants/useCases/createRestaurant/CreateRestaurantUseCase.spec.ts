import 'reflect-metadata';

import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateRestaurantUseCase } from './CreateRestaurantUseCase';

let createRestaurantUseCase: CreateRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Create Restaurant', () => {
  beforeEach(() => {
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory();
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();

    createRestaurantUseCase = new CreateRestaurantUseCase(
      restaurantsRepositoryInMemory,
      openingHoursRepositoryInMemory,
    );
  });

  it('should be able to create a new restaurant', async () => {
    const restaurant = await createRestaurantUseCase.execute({
      name: 'Restaurante Goomer',
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

    expect(restaurant).toHaveProperty('id');
  });

  it('should not be able to create a restaurant without the field name', async () => {
    await expect(
      createRestaurantUseCase.execute({
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

  it('should not be able to create a restaurant with the length field state different of two', async () => {
    await expect(
      createRestaurantUseCase.execute({
        name: 'Restaurante Goomer',
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
          {
            weekday: 'tuesday',
            start_time: '11:00',
            finish_time: '15:00',
          },
        ],
      }),
    ).rejects.toEqual(new AppError('State field must contain two characters'));
  });

  it('should not be able to create a restaurant if some weekday field is incorrect', async () => {
    await expect(
      createRestaurantUseCase.execute({
        name: 'Restaurante Goomer',
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
});
