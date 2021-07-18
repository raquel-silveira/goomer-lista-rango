import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAllRestaurantsUseCase } from './ListAllRestaurantsUseCase';

class ListAllRestaurantsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllRestaurantsUseCase = container.resolve(
      ListAllRestaurantsUseCase,
    );

    const restaurants = await listAllRestaurantsUseCase.execute();

    return response.json(restaurants);
  }
}

export { ListAllRestaurantsController };
