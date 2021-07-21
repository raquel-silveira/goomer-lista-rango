import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadPhotoRestaurantProductUseCase } from './UploadPhotoRestaurantProductUseCase';

class UploadPhotoRestaurantProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, restaurantId } = request.params;
    const photoFilename = request.file.filename;

    const uploadPhotoRestaurantProductUseCase = container.resolve(
      UploadPhotoRestaurantProductUseCase,
    );

    const updatedRestaurantProduct =
      await uploadPhotoRestaurantProductUseCase.execute({
        id,
        restaurantId,
        photoFilename,
      });

    return response.json(updatedRestaurantProduct);
  }
}

export { UploadPhotoRestaurantProductController };
