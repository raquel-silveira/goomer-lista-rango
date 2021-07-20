import { ICreatePromotionDTO } from '../dtos/ICreatePromotionDTO';
import { IUpdatePromotionDTO } from '../dtos/IUpdatePromotionDTO';
import { Promotion } from '../infra/postgres/entities/Promotion';

interface IPromotionsRepository {
  create({
    id,
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: ICreatePromotionDTO): Promise<Promotion>;

  updateByProductId({
    description,
    price_promotion,
    start_date,
    finish_date,
    start_time,
    finish_time,
    product_id,
  }: IUpdatePromotionDTO): Promise<Promotion>;

  findByProductId({ productId }: { productId: string }): Promise<Promotion>;
}

export { IPromotionsRepository };
