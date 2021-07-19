import { ICreatePromotionDTO } from '../dtos/ICreatePromotionDTO';
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
}

export { IPromotionsRepository };
