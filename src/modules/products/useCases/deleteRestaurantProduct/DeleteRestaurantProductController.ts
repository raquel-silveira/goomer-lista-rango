import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteRestaurantProductUseCase } from './DeleteRestaurantProductUseCase';

class DeleteRestaurantProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, restaurantId } = request.params;

    const deleteRestaurantProductUseCase = container.resolve(
      DeleteRestaurantProductUseCase,
    );

    await deleteRestaurantProductUseCase.execute({ id, restaurantId });

    return response.status(204).send();
  }
}

export { DeleteRestaurantProductController };
