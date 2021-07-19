import { v4 as uuidV4 } from 'uuid';

class Product {
  id: string;
  name: string;
  photo: string;
  price: number;
  category_id: string;
  restaurant_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Product };
