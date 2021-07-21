import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import 'reflect-metadata';
import { CreateRestaurantUseCase } from './CreateRestaurantUseCase';

let createRestaurantUseCase: CreateRestaurantUseCase;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Create Restaurant', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

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

  it('should be able to create a new restaurant with opening hours', async () => {
    const restaurant = await createRestaurantUseCase.execute({
      name: 'Restaurante Goomer',
      address: 'Rua São João',
      number: '500',
      neighborhood: 'Jardim Tóquio',
      city: 'Sorocaba',
      state: 'SP',
      country: 'Brasil',
      postal_code: '18279-050',
    });

    expect(restaurant.opening_hours.length).toBe(7);
  });

  it('should not be able to create a restaurant without the field name', async () => {
    await expect(
      createRestaurantUseCase.execute({
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

  it('should not be able to create a restaurant if some hour field is missing', async () => {
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
            weekday: 'monday',
            start_time: null,
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
    ).rejects.toEqual(new AppError('Hour field is missing'));
  });

  it('should not be able to create a restaurant if some hour format invalid', async () => {
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
            weekday: 'monday',
            start_time: '11:00',
            finish_time: '25:00',
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
    ).rejects.toEqual(new AppError('Hour format invalid'));
  });

  it('should not be able to create a restaurant if start time is greater then finish time', async () => {
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
            weekday: 'monday',
            start_time: '11:00',
            finish_time: '10:00',
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
    ).rejects.toEqual(
      new AppError('Start time does not can be greater then finish time'),
    );
  });

  it('should not be able to create a restaurant if times does not have minimum interval of 15 minutes', async () => {
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
            weekday: 'monday',
            start_time: '10:00',
            finish_time: '10:10',
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
    ).rejects.toEqual(
      new AppError('Times must have a minimum interval of 15 minutes'),
    );
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
