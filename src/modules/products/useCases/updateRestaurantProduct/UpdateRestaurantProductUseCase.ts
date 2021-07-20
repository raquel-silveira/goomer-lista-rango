import { Category } from '@modules/products/infra/postgres/entities/Category';
import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';
import {
  IProductsRepository,
  IProductsResponse,
} from '@modules/products/repositories/IProductsRepository';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';
import { validate, version } from 'uuid';

import { AppError } from '@shared/errors/AppError';

interface IPromotion {
  description: string;
  price_promotion: number;
  start_date: string;
  finish_date: string;
  start_time: string;
  finish_time: string;
}

interface IRequest {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  promotion?: IPromotion;
}

@injectable()
class UpdateRestaurantProductUseCase {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('PromotionsRepository')
    private promotionsRepository: IPromotionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  async execute({
    id,
    restaurantId,
    name,
    price,
    category,
    promotion,
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

    if (!name) {
      throw new AppError('Name is required');
    }

    const restaurantFound = await this.restaurantsRepository.findOne({
      id: restaurantId,
    });

    if (!restaurantFound) {
      throw new AppError('Restaurant not found');
    }

    const product = await this.productsRepository.findOne({ id });

    if (!product) {
      throw new AppError('Product not found');
    }

    let categoryInfo: Category;

    if (category) {
      const categoryFound = await this.categoriesRepository.findByName(
        category,
      );

      if (categoryFound) {
        categoryInfo = categoryFound;
      } else {
        const newCategory = {
          ...new Category(),
          name: category,
          restaurantId,
        };

        const categoryCreated = await this.categoriesRepository.create(
          newCategory,
        );
        categoryInfo = categoryCreated;
      }
    }

    const updatedProduct = await this.productsRepository.updateById({
      id,
      name,
      price,
      category_id: categoryInfo?.id,
    });

    const updatedPromotion = await this.promotionsRepository.updateByProductId({
      product_id: id,
      ...promotion,
    });

    const productPromotionUpdated = {
      ...updatedProduct,
      category: categoryInfo?.name,
      promotion: updatedPromotion,
    };

    return productPromotionUpdated;
  }
}

export { UpdateRestaurantProductUseCase };
