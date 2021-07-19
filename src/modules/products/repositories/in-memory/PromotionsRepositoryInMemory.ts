import { ICreatePromotionDTO } from '@modules/products/dtos/ICreatePromotionDTO';
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
}

export { PromotionsRepositoryInMemory };
