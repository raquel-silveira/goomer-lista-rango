import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRestaurantProductUseCase } from './CreateRestaurantProductUseCase';

class CreateRestaurantProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, price, category, promotion } = request.body;
    const { restaurantId } = request.params;

    const createRestaurantProductUseCase = container.resolve(
      CreateRestaurantProductUseCase,
    );

    const product = await createRestaurantProductUseCase.execute({
      restaurantId,
      name,
      price,
      category,
      promotion,
    });

    return response.json(product);
  }
}

export { CreateRestaurantProductController };
