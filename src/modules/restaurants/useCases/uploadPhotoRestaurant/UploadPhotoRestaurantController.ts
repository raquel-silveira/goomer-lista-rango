import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadPhotoRestaurantUseCase } from './UploadPhotoRestaurantUseCase';

class UploadPhotoRestaurantController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const photoFilename = request.file.filename;

    const uploadPhotoRestaurantUseCase = container.resolve(
      UploadPhotoRestaurantUseCase,
    );

    const updatedRestaurant = await uploadPhotoRestaurantUseCase.execute({
      id,
      photoFilename,
    });

    return response.json(updatedRestaurant);
  }
}

export { UploadPhotoRestaurantController };
