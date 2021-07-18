import {
  IRestaurantsRepository,
  IRestaurantsResponse,
} from '@modules/restaurants/repositories/IRestaurantRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListAllRestaurantsUseCase {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantRepository: IRestaurantsRepository,
  ) {}

  async execute(): Promise<IRestaurantsResponse[]> {
    const restaurants = await this.restaurantRepository.findAll();

    return restaurants;
  }
}

export { ListAllRestaurantsUseCase };
