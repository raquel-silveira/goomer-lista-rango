import { ICreateOpeningHoursDTO } from '../dtos/ICreateOpeningHoursDTO';
import { OpeningHours } from '../infra/postgres/entities/OpeningHours';

interface IOpeningHoursRepository {
  create(openingHours: ICreateOpeningHoursDTO[]): Promise<OpeningHours[]>;

  deleteByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<void>;

  findByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<OpeningHours[]>;
}

export { IOpeningHoursRepository };
