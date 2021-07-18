import { ICreateOpeningHoursDTO } from '../../dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '../../infra/postgres/entities/OpeningHours';
import { IOpeningHoursRepository } from '../IOpeningHoursRepository';

class OpeningHoursRepositoryInMemory implements IOpeningHoursRepository {
  public openingHoursStorage: OpeningHours[] = [];

  async create(
    openingHours: ICreateOpeningHoursDTO[],
  ): Promise<OpeningHours[]> {
    this.openingHoursStorage.push(...openingHours);

    return openingHours;
  }

  async delete({ restaurantId }: { restaurantId: string }): Promise<void> {
    this.openingHoursStorage = this.openingHoursStorage.filter(
      openingHour => openingHour.restaurant_id !== restaurantId,
    );
  }
}

export { OpeningHoursRepositoryInMemory };
