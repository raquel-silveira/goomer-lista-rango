import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateRestaurantProductUseCase } from './UpdateRestaurantProductUseCase';

class UpdateRestaurantProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, restaurantId } = request.params;
    const { name, price, category, promotion } = request.body;

    const updateRestaurantProductUseCase = container.resolve(
      UpdateRestaurantProductUseCase,
    );

    const product = await updateRestaurantProductUseCase.execute({
      id,
      restaurantId,
      name,
      price,
      category,
      promotion,
    });

    return response.json(product);
  }
}

export { UpdateRestaurantProductController };
