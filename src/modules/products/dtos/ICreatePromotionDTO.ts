interface ICreatePromotionDTO {
  id: string;
  description: string;
  price_promotion: number;
  start_date: string;
  finish_date: string;
  start_time: string;
  finish_time: string;
  product_id: string;
}

export { ICreatePromotionDTO };
