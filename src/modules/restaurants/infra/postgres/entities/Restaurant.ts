import { v4 as uuidV4 } from 'uuid';

class Restaurant {
  id: string;
  name: string;
  photo: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Restaurant };
