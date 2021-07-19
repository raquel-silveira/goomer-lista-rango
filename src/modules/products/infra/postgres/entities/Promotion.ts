import { v4 as uuidV4 } from 'uuid';

class Promotion {
  id: string;
  description: string;
  price_promotion: number;
  start_date: string;
  finish_date: string;
  start_time: string;
  finish_time: string;
  product_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Promotion };
