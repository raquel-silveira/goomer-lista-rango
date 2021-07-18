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
}

export { OpeningHoursRepositoryInMemory };
