import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRestaurantUseCase } from './CreateRestaurantUseCase';

class CreateRestaurantController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      address,
      number,
      neighborhood,
      city,
      state,
      country,
      postal_code,
      opening_hours,
    } = request.body;

    const createRestaurantUseCase = container.resolve(CreateRestaurantUseCase);

    const restaurant = await createRestaurantUseCase.execute({
      name,
      address,
      number,
      neighborhood,
      city,
      state,
      country,
      postal_code,
      opening_hours,
    });

    return response.json(restaurant);
  }
}

export { CreateRestaurantController };
