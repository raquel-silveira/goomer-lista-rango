import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { UpdateRestaurantProductUseCase } from './UpdateRestaurantProductUseCase';

let updateRestaurantProductUseCase: UpdateRestaurantProductUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;

describe('Update Product', () => {
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

    updateRestaurantProductUseCase = new UpdateRestaurantProductUseCase(
      productsRepositoryInMemory,
      promotionsRepositoryInMemory,
      categoriesRepositoryInMemory,
      restaurantsRepositoryInMemory,
    );
  });

  it('should be able to update a product', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    const productUpdated = await updateRestaurantProductUseCase.execute({
      id: product.id,
      name: 'Biscoito',
      price: 3.5,
      category: 'doce',
      restaurantId: restaurant.id,
    });

    expect(productUpdated.name).toBe('Biscoito');
  });

  it('should be able to update a product without category', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    const productUpdated = await updateRestaurantProductUseCase.execute({
      id: product.id,
      name: 'Biscoito',
      price: 3.5,
      category: '',
      restaurantId: restaurant.id,
    });

    expect(productUpdated.name).toBe('Biscoito');
  });

  it('should not be able to update without id param', async () => {
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

    await expect(
      updateRestaurantProductUseCase.execute({
        id: '',
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: '',
      }),
    ).rejects.toEqual(new AppError('Id is required'));
  });

  it('should not be able to update without name field', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await expect(
      updateRestaurantProductUseCase.execute({
        id: product.id,
        name: '',
        price: 3.5,
        category: 'doce',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Name is required'));
  });

  it('should not be able to update without restaurant id param', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await expect(
      updateRestaurantProductUseCase.execute({
        id: product.id,
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: '',
      }),
    ).rejects.toEqual(new AppError('Restaurant id is required'));
  });

  it('should not be able to update if id is invalid', async () => {
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

    await expect(
      updateRestaurantProductUseCase.execute({
        id: 'wrong-id',
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to update if restaurant id is invalid', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await expect(
      updateRestaurantProductUseCase.execute({
        id: product.id,
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: 'wrong-id',
      }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
  });

  it('should not be able to update if products does not exists', async () => {
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
      updateRestaurantProductUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460542',
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Product not found'));
  });

  it('should not be able to update if restaurant does not exists', async () => {
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await expect(
      updateRestaurantProductUseCase.execute({
        id: product.id,
        name: 'Biscoito',
        price: 3.5,
        category: 'doce',
        restaurantId: '7975d470-a856-48a2-ac1b-b967b3014b66',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
