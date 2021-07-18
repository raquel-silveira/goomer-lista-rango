import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateRestaurantUseCase } from './UpdateRestaurantUseCase';

class UpdateRestaurantController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
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

    const updateRestaurantUseCase = container.resolve(UpdateRestaurantUseCase);

    const restaurant = await updateRestaurantUseCase.execute({
      id,
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

export { UpdateRestaurantController };
