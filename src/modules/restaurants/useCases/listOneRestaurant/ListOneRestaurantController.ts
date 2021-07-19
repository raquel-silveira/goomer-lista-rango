import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListOneRestaurantUseCase } from './ListOneRestaurantUseCase';

class ListOneRestaurantController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listOneRestaurantUseCase = container.resolve(
      ListOneRestaurantUseCase,
    );

    const restaurant = await listOneRestaurantUseCase.execute({ id });

    return response.json(restaurant);
  }
}

export { ListOneRestaurantController };
