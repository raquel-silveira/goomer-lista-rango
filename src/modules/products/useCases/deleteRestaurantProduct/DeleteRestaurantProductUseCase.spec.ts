import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { StorageProviderInMemory } from '@shared/container/providers/StorageProvider/in-memory/StorageProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { DeleteRestaurantProductUseCase } from './DeleteRestaurantProductUseCase';

let deleteRestaurantProductUseCase: DeleteRestaurantProductUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;

describe('Delete Restaurant Product', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );

    promotionsRepositoryInMemory = new PromotionsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    storageProviderInMemory = new StorageProviderInMemory();

    productsRepositoryInMemory = new ProductsRepositoryInMemory(
      promotionsRepositoryInMemory.promotions,
      categoriesRepositoryInMemory.categories,
    );

    deleteRestaurantProductUseCase = new DeleteRestaurantProductUseCase(
      productsRepositoryInMemory,
      restaurantsRepositoryInMemory,
      storageProviderInMemory,
    );
  });

  it('should be able to delete a restaurant product by id', async () => {
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

    await productsRepositoryInMemory.updatePhotoById({
      id: product.id,
      photoFilename: 'image.jpg',
    });

    await expect(
      deleteRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: restaurant.id,
      }),
    ).resolves.not.toThrow();
  });

  it('should not be able to delete without id param', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: '',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Id is required'));
  });

  it('should not be able to delete if id is invalid', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: 'wrong-id',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to delete without id restaurant param', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: '',
      }),
    ).rejects.toEqual(new AppError('Restaurant id is required'));
  });

  it('should not be able to delete if restaurant id is invalid', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: 'wrong-id',
      }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
  });

  it('should not be able to delete if product does not exists', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460543',
        restaurantId: restaurant.id,
      }),
    ).rejects.toEqual(new AppError('Product not found'));
  });

  it('should not be able to delete if restaurant does not exists', async () => {
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
      deleteRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: 'a29fc323-5365-4baf-8461-fe2cae460542',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
