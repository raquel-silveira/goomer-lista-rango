import { Category } from '@modules/products/infra/postgres/entities/Category';
import { Product } from '@modules/products/infra/postgres/entities/Product';
import { Promotion } from '@modules/products/infra/postgres/entities/Promotion';
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
  description?: string;
  price_promotion?: number;
  start_date?: string;
  finish_date?: string;
  start_time?: string;
  finish_time?: string;
}

interface IRequest {
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  promotion?: IPromotion;
}

@injectable()
class CreateRestaurantProductUseCase {
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
  s;

  async execute({
    restaurantId,
    name,
    price,
    category,
    promotion,
  }: IRequest): Promise<IProductsResponse> {
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

    const product = {
      ...new Product(),
      name,
      price,
      category_id: categoryInfo?.id || null,
      restaurantId,
    };

    const productCreated = await this.productsRepository.create(product);

    const newPromotion = {
      ...new Promotion(),
      ...promotion,
      product_id: product.id,
    };

    const promotionCreated = await this.promotionsRepository.create(
      newPromotion,
    );

    const productPromotionCreated = {
      ...productCreated,
      category: categoryInfo?.name || null,
      promotion: promotionCreated,
    };

    return productPromotionCreated;
  }
}

export { CreateRestaurantProductUseCase };
