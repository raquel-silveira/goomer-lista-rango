import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteRestaurantUseCase } from './DeleteRestaurantUseCase';

class DeleteRestaurantController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteRestaurantUseCase = container.resolve(DeleteRestaurantUseCase);

    await deleteRestaurantUseCase.execute({ id });

    return response.status(204).send();
  }
}

export { DeleteRestaurantController };
