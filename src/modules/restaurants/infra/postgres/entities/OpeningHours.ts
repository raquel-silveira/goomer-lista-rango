import { v4 as uuidV4 } from 'uuid';

class OpeningHours {
  id: string;
  weekday: string;
  start_time: string;
  finish_time: string;
  restaurant_id?: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { OpeningHours };
