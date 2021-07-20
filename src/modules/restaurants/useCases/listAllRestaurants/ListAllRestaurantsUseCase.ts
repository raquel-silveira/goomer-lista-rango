import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListAllRestaurantsUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  async execute(): Promise<IRestaurantsResponse[]> {
    const restaurants = await this.restaurantsRepository.findAll();

    return restaurants;
  }
}

export { ListAllRestaurantsUseCase };
