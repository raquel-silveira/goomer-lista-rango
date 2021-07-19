import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAllRestaurantProductsUseCase } from './listAllRestaurantProductsUseCase';

class ListAllRestaurantProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { restaurantId } = request.params;

    const listAllRestaurantProductsUseCase = container.resolve(
      ListAllRestaurantProductsUseCase,
    );

    const products = await listAllRestaurantProductsUseCase.execute({
      restaurantId,
    });

    return response.json(products);
  }
}

export { ListAllRestaurantProductsController };
