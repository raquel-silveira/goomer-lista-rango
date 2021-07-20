import 'reflect-metadata';

import { CategoriesRepositoryInMemory } from '@modules/products/repositories/in-memory/CategoriesRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { PromotionsRepositoryInMemory } from '@modules/products/repositories/in-memory/PromotionsRepositoryInMemory';
import { OpeningHoursRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/OpeningHoursRespositoryInMemory';
import { RestaurantsRepositoryInMemory } from '@modules/restaurants/repositories/in-memory/RestaurantsRepositoryInMemory';

import { StorageProviderInMemory } from '@shared/container/providers/StorageProvider/in-memory/StorageProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { UploadPhotoRestaurantProductUseCase } from './UploadPhotoRestaurantProductUseCase';

let uploadPhotoRestaurantProductUseCase: UploadPhotoRestaurantProductUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let promotionsRepositoryInMemory: PromotionsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let restaurantsRepositoryInMemory: RestaurantsRepositoryInMemory;
let openingHoursRepositoryInMemory: OpeningHoursRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;

describe('Upload Product Photo', () => {
  beforeEach(() => {
    openingHoursRepositoryInMemory = new OpeningHoursRepositoryInMemory();
    restaurantsRepositoryInMemory = new RestaurantsRepositoryInMemory(
      openingHoursRepositoryInMemory.openingHoursStorage,
    );
    storageProviderInMemory = new StorageProviderInMemory();

    promotionsRepositoryInMemory = new PromotionsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();

    productsRepositoryInMemory = new ProductsRepositoryInMemory(
      promotionsRepositoryInMemory.promotions,
      categoriesRepositoryInMemory.categories,
    );

    uploadPhotoRestaurantProductUseCase =
      new UploadPhotoRestaurantProductUseCase(
        productsRepositoryInMemory,
        categoriesRepositoryInMemory,
        promotionsRepositoryInMemory,
        restaurantsRepositoryInMemory,
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    const updatedPhotoRestaurantProduct =
      await uploadPhotoRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: restaurant.id,
        photoFilename: 'example.jpg',
      });

    expect(updatedPhotoRestaurantProduct.id).toBe(product.id);
    expect(updatedPhotoRestaurantProduct.photo).toBe('example.jpg');
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await uploadPhotoRestaurantProductUseCase.execute({
      id: product.id,
      restaurantId: restaurant.id,
      photoFilename: 'example.jpg',
    });

    await uploadPhotoRestaurantProductUseCase.execute({
      id: product.id,
      restaurantId: restaurant.id,
      photoFilename: 'example-2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('example.jpg');
  });

  it('should not be able to upload photo without id param', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: '',
        restaurantId: restaurant.id,
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Id is required'));
  });

  it('should not be able to upload photo without restaurant id param', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: '',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Restaurant id is required'));
  });

  it('should not be able to upload photo if id is invalid', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: 'wrong-id',
        restaurantId: restaurant.id,
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Invalid id'));
  });

  it('should not be able to upload photo if restaurant id is invalid', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: 'wrong-id',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Invalid restaurant id'));
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

    const product = await productsRepositoryInMemory.create({
      id: 'a29fc323-5365-4baf-8461-fe2cae460542',
      name: 'Bolacha',
      price: 3.5,
      category_id: '1',
      restaurantId: restaurant.id,
    });

    await expect(
      uploadPhotoRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: restaurant.id,
        photoFilename: '',
      }),
    ).rejects.toEqual(new AppError('Invalid file'));
  });

  it('should not be able to upload photo if product does not exists', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: 'a29fc323-5365-4baf-8461-fe2cae460541',
        restaurantId: restaurant.id,
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Product not found'));
  });

  it('should not be able to upload photo if restaurant does not exists', async () => {
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
      uploadPhotoRestaurantProductUseCase.execute({
        id: product.id,
        restaurantId: 'a29fc323-5365-4baf-8461-fe2cae460543',
        photoFilename: 'example.jpg',
      }),
    ).rejects.toEqual(new AppError('Restaurant not found'));
  });
});
