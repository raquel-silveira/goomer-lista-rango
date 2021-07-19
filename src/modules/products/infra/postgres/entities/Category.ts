import { v4 as uuidV4 } from 'uuid';

class Category {
  id: string;
  name: string;
  restaurant_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Category };
