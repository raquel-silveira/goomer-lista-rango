import { ICreateOpeningHoursDTO } from '@modules/restaurants/dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '@modules/restaurants/infra/postgres/entities/OpeningHours';

import { IOpeningHoursRepository } from '../IOpeningHoursRepository';

class OpeningHoursRepositoryInMemory implements IOpeningHoursRepository {
  openingHoursStorage: OpeningHours[] = [];

  async create(
    openingHours: ICreateOpeningHoursDTO[],
  ): Promise<OpeningHours[]> {
    this.openingHoursStorage.push(...openingHours);

    return openingHours;
  }
}

export { OpeningHoursRepositoryInMemory };
