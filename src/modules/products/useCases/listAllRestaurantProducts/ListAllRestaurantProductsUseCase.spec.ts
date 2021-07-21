import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { ListAllRestaurantProductsUseCase } from './ListAllRestaurantProductsUseCase';

let listAllRestaurantProductsUseCase: ListAllRestaurantProductsUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('List All Restaurant Products', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    promotionsRepositoryInMemory = new PromotionsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();

    productsRepositoryInMemory = new ProductsRepositoryInMemory(
      promotionsRepositoryInMemory.promotions,
      categoriesRepositoryInMemory.categories,
    );

    listAllRestaurantProductsUseCase = new ListAllRestaurantProductsUseCase(
      productsRepositoryInMemory,
      restaurantsRepositoryInMemory,
    );
  });

  it('should be able to list all restaurant products', async () => {
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

    await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460543',
      name: 'Lasanha',
      price: 30.0,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    const listedRestaurantProducts =
      await listAllRestaurantProductsUseCase.execute({
        restaurantId: restaurant.id,
      });

    expect(listedRestaurantProducts.length).toBe(2);
  });

  it('should be able to list an empty array if no restaurant products', async () => {
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

    const listedRestaurantProducts =
      await listAllRestaurantProductsUseCase.execute({
        restaurantId: restaurant.id as string,
      });

    expect(listedRestaurantProducts.length).toBe(0);
  });

  it('should not be able to list without restaurant id param', async () => {
    await expect(
      listAllRestaurantProductsUseCase.execute({ restaurantId: '' }),
    ).rejects.toEqual(new AppError('Restaurant id is required'));
  });

  it('should not be able to list if restaurant id is invalid', async () => {
    await expect(
      listAllRestaurantProductsUseCase.execute({ restaurantId: 'wrong-id' }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
  });

  it('should not be able to list if restaurant does not exists', async () => {
    await expect(
      listAllRestaurantProductsUseCase.execute({
        restaurantId: 'a29fc323-5365-4baf-8461-fe2cae460541',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
