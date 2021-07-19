import { ICreateOpeningHoursDTO } from '@modules/restaurants/dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';

import { IOpeningHoursRepository } from '../IOpeningHoursRepository';

class OpeningHoursRepositoryInMemory implements IOpeningHoursRepository {
  public openingHoursStorage: OpeningHours[] = [];

  async create(
    openingHours: ICreateOpeningHoursDTO[],
  ): Promise<OpeningHours[]> {
    this.openingHoursStorage.push(...openingHours);

    return openingHours;
  }

  async deleteByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<void> {
    this.openingHoursStorage = this.openingHoursStorage.filter(
      openingHour => openingHour.restaurant_id !== restaurantId,
    );
  }

  async findByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<OpeningHours[]> {
    const openingHours = this.openingHoursStorage.filter(
      openingHour => openingHour.restaurant_id === restaurantId,
    );

    return openingHours;
  }
}

export { OpeningHoursRepositoryInMemory };
