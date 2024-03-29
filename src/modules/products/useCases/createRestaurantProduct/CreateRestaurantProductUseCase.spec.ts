import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateRestaurantProductUseCase } from './CreateRestaurantProductUseCase';

let createRestaurantProductUseCase: CreateRestaurantProductUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Create Restaurant Product', () => {
  beforeEach(() => {
    productsRepositoryInMemory = new ProductsRepositoryInMemory();
    promotionsRepositoryInMemory = new PromotionsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    createRestaurantProductUseCase = new CreateRestaurantProductUseCase(
      productsRepositoryInMemory,
      promotionsRepositoryInMemory,
      categoriesRepositoryInMemory,
      restaurantsRepositoryInMemory,
    );
  });

  it('should be able to create a new product', async () => {
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

    const product = await createRestaurantProductUseCase.execute({
      name: 'Bolacha',
      price: 3.5,
      category: 'doce',
      promotion: {
        description: 'metade do preço',
        price_promotion: 1.25,
        start_date: '2021-05-09',
        finish_date: '2021-05-10',
        start_time: '13:00',
        finish_time: '13:00',
      },
      restaurantId: restaurant.id,
    });

    expect(product).toHaveProperty('id');
  });

  it('should be able to create a product without category', async () => {
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

    const product = await createRestaurantProductUseCase.execute({
      name: 'Bolacha',
      price: 3.5,
      category: '',
      promotion: {
        description: 'metade do preço',
        price_promotion: 1.25,
        start_date: '2021-05-09',
        finish_date: '2021-05-10',
        start_time: '13:00',
        finish_time: '13:00',
      },
      restaurantId: restaurant.id,
    });

    expect(product.name).toBe('Bolacha');
  });

  it('should be able to create a product without promotion', async () => {
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

    const product = await createRestaurantProductUseCase.execute({
      name: 'Bolacha',
      price: 3.5,
      category: 'doce',
      restaurantId: restaurant.id,
    });

    expect(product.name).toBe('Bolacha');
  });

  it('should not be able to create a product without the field name', async () => {
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
      createRestaurantProductUseCase.execute({
        name: '',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Name is required'));
  });

  it('should not be able to create a product if promotion does not have all date and time fields', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: null,
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(
      new AppError('Promotion must have all date and time fields'),
    );
  });

  it('should not be able to create a product if date format is invalid', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '10/10/2021',
          finish_date: '11/10/2021',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Date format invalid'));
  });

  it('should not be able to create a product if hour format is invalid', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '25:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Hour format invalid'));
  });

  it('should not be able to create a product with promotion whithout price promotion', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: null,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '14:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Price is required to promotion'));
  });

  it('should not be able to create a product if start date is greater then finish date', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 2.5,
          start_date: '2021-05-11',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '14:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(
      new AppError('Start date does not can be greater then finish date'),
    );
  });

  it('should not be able to create a product if times does not have a minimum interval of 15 minutes', async () => {
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
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 2.5,
          start_date: '2021-05-11',
          finish_date: '2021-05-11',
          start_time: '13:00',
          finish_time: '13:14',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(
      new AppError('Times must have a minimum interval of 15 minutes'),
    );
  });

  it('should not be able to create a product without restaurant id', async () => {
    await expect(
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: '',
      }),
    ).rejects.toEqual(new AppError('Restaurant id is required'));
  });

  it('should not be able to create a product with invalid restaurant id', async () => {
    await expect(
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: 'wrong-id',
      }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
  });

  it('should not be able to create a product if restaurant does not exists', async () => {
    await expect(
      createRestaurantProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-09',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: 'a29fc323-5365-4baf-8461-fe2cae460541',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
