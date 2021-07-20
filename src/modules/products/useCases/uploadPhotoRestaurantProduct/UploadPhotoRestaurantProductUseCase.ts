import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';
import {
  IProductsRepository,
  IProductsResponse,
} from '@modules/products/repositories/IProductsRepository';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  restaurantId: string;
  photoFilename?: string;
}

@injectable()
class UploadPhotoRestaurantProductUseCase {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('PromotionsRepository')
    private promotionsRepository: IPromotionsRepository,

    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    id,
    restaurantId,
    photoFilename,
  }: IRequest): Promise<IProductsResponse> {
    if (!id) {
      throw new AppError('Id is required');
    }

    if (!validate(id) || version(id) !== 4) {
      throw new AppError('Invalid id');
    }

    if (!restaurantId) {
      throw new AppError('Restaurant id is required');
    }

    if (!validate(restaurantId) || version(restaurantId) !== 4) {
      throw new AppError('Invalid restaurant id');
    }

    if (!photoFilename) {
      throw new AppError('Invalid file');
    }

    const restaurant = await this.restaurantsRepository.findOne({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new AppError('Restaurant not found');
    }

    const product = await this.productsRepository.findOne({ id });

    if (!product) {
      throw new AppError('Product not found');
    }

    if (product.photo) {
      await this.storageProvider.deleteFile(product.photo);
    }

    const storagePhotoFilename = await this.storageProvider.saveFile(
      photoFilename,
    );

    const productPhotoUpdated = await this.productsRepository.updatePhotoById({
      id,
      photoFilename: storagePhotoFilename,
    });

    const categoryFound = await this.categoriesRepository.findById(
      productPhotoUpdated.category_id,
    );

    const promotionFound = await this.promotionsRepository.findByProductId({
      productId: productPhotoUpdated.id,
    });

    const productCategoryPromotion = {
      id: productPhotoUpdated.id,
      name: productPhotoUpdated.name,
      photo: productPhotoUpdated.photo,
      price: productPhotoUpdated.price,
      category: categoryFound?.name || null,
      promotion: { ...promotionFound },
    };

    return productCategoryPromotion;
  }
}

export { UploadPhotoRestaurantProductUseCase };
