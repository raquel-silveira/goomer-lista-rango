import { ICreateOpeningHoursDTO } from '../dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '../infra/postgres/entities/OpeningHours';

interface IOpeningHoursRepository {
  create(openingHours: ICreateOpeningHoursDTO[]): Promise<OpeningHours[]>;
}

export { IOpeningHoursRepository };
