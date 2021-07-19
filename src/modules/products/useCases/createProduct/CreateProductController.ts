import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateProductUseCase } from './CreateProductUseCase';

class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, price, category, promotion } = request.body;
    const { restaurantId } = request.params;

    const createProductUseCase = container.resolve(CreateProductUseCase);

    const product = await createProductUseCase.execute({
      restaurantId,
      name,
      price,
      category,
      promotion,
    });

    return response.json(product);
  }
}

export { CreateProductController };
