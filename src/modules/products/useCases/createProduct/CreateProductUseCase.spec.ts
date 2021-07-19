import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateProductUseCase } from './CreateProductUseCase';

let createProductUseCase: CreateProductUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Create Restaurant', () => {
  beforeEach(() => {
    productsRepositoryInMemory = new ProductsRepositoryInMemory();
    promotionsRepositoryInMemory = new PromotionsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    createProductUseCase = new CreateProductUseCase(
      productsRepositoryInMemory,
      promotionsRepositoryInMemory,
      categoriesRepositoryInMemory,
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

    const product = await createProductUseCase.execute({
      name: 'Bolacha',
      price: 3.5,
      category: 'doce',
      promotion: {
        description: 'metade do preço',
        price_promotion: 1.25,
        start_date: '2021-05-21',
        finish_date: '2021-05-10',
        start_time: '13:00',
        finish_time: '13:00',
      },
      restaurantId: restaurant.id,
    });

    expect(product).toHaveProperty('id');
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
      createProductUseCase.execute({
        name: '',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-21',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Name is required'));
  });

  it('should not be able to create a product without restaurant id', async () => {
    await expect(
      createProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-21',
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
      createProductUseCase.execute({
        name: 'Bolacha',
        price: 3.5,
        category: 'doce',
        promotion: {
          description: 'metade do preço',
          price_promotion: 1.25,
          start_date: '2021-05-21',
          finish_date: '2021-05-10',
          start_time: '13:00',
          finish_time: '13:00',
        },
        restaurantId: 'wrong-id',
      }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
  });
});
