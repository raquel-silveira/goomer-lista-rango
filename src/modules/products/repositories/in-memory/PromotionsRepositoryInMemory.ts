import { ICreatePromotionDTO } from '@modules/products/dtos/ICreatePromotionDTO';
import { IUpdatePromotionDTO } from '@modules/products/dtos/IUpdatePromotionDTO';
import { Promotion } from '@modules/products/infra/postgres/entities/Promotion';

import { IPromotionsRepository } from '../IPromotionsRepository';

class PromotionsRepositoryInMemory implements IPromotionsRepository {
  promotions: Promotion[] = [];

  async create({
    id,
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: ICreatePromotionDTO): Promise<Promotion> {
    const promotion = new Promotion();

    Object.assign(promotion, {
      id,
      description,
      price_promotion,
      start_date,
      finish_date,
      start_time,
      finish_time,
      product_id,
    });

    this.promotions.push(promotion);

    return promotion;
  }

  async updateByProductId({
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: IUpdatePromotionDTO): Promise<Promotion> {
    const promotionFound = this.promotions.find(
      promotion => promotion.product_id === product_id,
    );

    if (!promotionFound) {
      return null;
    }

    const updatedFields = {
      ...(description ? { description } : {}),
      ...(price_promotion ? { price_promotion } : {}),
      ...(start_date ? { start_date } : {}),
      ...(finish_date ? { finish_date } : {}),
      ...(start_time ? { start_time } : {}),
      ...(finish_time ? { finish_time } : {}),
    };

    const productIndex = this.promotions.findIndex(
      promotion => promotion.product_id === product_id,
    );

    this.promotions[productIndex] = {
      ...this.promotions[productIndex],
      ...updatedFields,
    };

    const updatedPromotion = { ...this.promotions[productIndex] };

    return updatedPromotion;
  }

  async findByProductId({
    productId,
  }: {
    productId: string;
  }): Promise<Promotion> {
    const promotionFound = this.promotions.find(
      promotion => promotion.product_id === productId,
    );

    if (!promotionFound) {
      return null;
    }

    return promotionFound;
  }
}

export { PromotionsRepositoryInMemory };
