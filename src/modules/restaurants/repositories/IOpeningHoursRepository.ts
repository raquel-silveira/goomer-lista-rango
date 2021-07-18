import { ICreateOpeningHoursDTO } from '../dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '../infra/postgres/entities/OpeningHours';

interface IOpeningHoursRepository {
  create(openingHours: ICreateOpeningHoursDTO[]): Promise<OpeningHours[]>;

  delete({ restaurantId }: { restaurantId: string }): Promise<void>;
}

export { IOpeningHoursRepository };
