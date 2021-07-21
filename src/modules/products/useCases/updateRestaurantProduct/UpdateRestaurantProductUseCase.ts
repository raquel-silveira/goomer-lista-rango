import { Category } from '@modules/products/infra/postgres/entities/Category';
import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';
import {
  IProductsRepository,
  IProductsResponse,
} from '@modules/products/repositories/IProductsRepository';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { differenceInMinutes } from 'date-fns';
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

    const datePromotion = [
      promotion?.start_date,
      promotion?.finish_time,
      promotion?.start_date,
      promotion?.finish_date,
    ] as string[];

    const datePromotionValues = datePromotion.filter(
      datePromotionField => datePromotionField && datePromotionField !== '',
    );

    if (datePromotionValues.length >= 1) {
      if (datePromotionValues.length < datePromotion.length) {
        throw new AppError('Promotion must have all date and time fields');
      }

      if (
        !/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(
          promotion.start_date,
        ) ||
        !/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(
          promotion.finish_date,
        )
      ) {
        throw new AppError('Date format invalid');
      }

      if (
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(promotion.start_time) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(promotion.finish_time)
      ) {
        throw new AppError('Hour format invalid');
      }

      if (!promotion.price_promotion) {
        throw new AppError('Price is required to promotion');
      }

      const startTime = promotion.start_time.split(':');
      const finishTime = promotion.finish_time.split(':');

      const startDate = new Date(promotion.start_date);
      const finishDate = new Date(promotion.finish_date);

      const dateStartTime = new Date(
        startDate.setHours(Number(startTime[0]), Number(startTime[1]), 0),
      );

      const dateFinishTime = new Date(
        finishDate.setHours(Number(finishTime[0]), Number(finishTime[1]), 0),
      );

      if (dateStartTime > dateFinishTime) {
        throw new AppError(
          'Start date does not can be greater then finish date',
        );
      }

      const minutesDifference = differenceInMinutes(
        dateFinishTime,
        dateStartTime,
      );

      if (minutesDifference < 15) {
        throw new AppError('Times must have a minimum interval of 15 minutes');
      }
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
      category_id: categoryInfo?.id || null,
    });

    const updatedPromotion = await this.promotionsRepository.updateByProductId({
      product_id: id,
      description: promotion?.description || null,
      price_promotion: promotion?.price_promotion || null,
      start_date: promotion?.start_date || null,
      finish_date: promotion?.finish_date || null,
      start_time: promotion?.start_time || null,
      finish_time: promotion?.finish_time || null,
    });

    const productPromotionUpdated = {
      ...updatedProduct,
      category: categoryInfo?.name || null,
      promotion: updatedPromotion,
    };

    return productPromotionUpdated;
  }
}

export { UpdateRestaurantProductUseCase };
