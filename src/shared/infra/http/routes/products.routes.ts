import { upload } from '@config/upload';
import { CreateRestaurantProductController } from '@modules/products/useCases/createRestaurantProduct/CreateRestaurantProductController';
import { DeleteRestaurantProductController } from '@modules/products/useCases/deleteRestaurantProduct/DeleteRestaurantProductController';
import { ListAllRestaurantProductsController } from '@modules/products/useCases/listAllRestaurantProducts/ListAllRestaurantProductsController';
import { UpdateRestaurantProductController } from '@modules/products/useCases/updateRestaurantProduct/UpdateRestaurantProductController';
import { UploadPhotoRestaurantProductController } from '@modules/products/useCases/uploadPhotoRestaurantProduct/UploadPhotoRestaurantProductController';
import { Router } from 'express';
import multer from 'multer';

const productsRoutes = Router();

const uploadPhoto = multer(upload.multer);

const listAllRestaurantProductsController =
  new ListAllRestaurantProductsController();
const createRestaurantProductController =
  new CreateRestaurantProductController();
const updateRestaurantProductController =
  new UpdateRestaurantProductController();
const deleteRestaurantProductController =
  new DeleteRestaurantProductController();
const uploadPhotoRestaurantProductController =
  new UploadPhotoRestaurantProductController();

productsRoutes.get(
  '/:restaurantId',
  listAllRestaurantProductsController.handle,
);

productsRoutes.post('/:restaurantId', createRestaurantProductController.handle);

productsRoutes.put(
  '/:restaurantId/:id',
  updateRestaurantProductController.handle,
);

productsRoutes.delete(
  '/:restaurantId/:id',
  deleteRestaurantProductController.handle,
);

productsRoutes.patch(
  '/photo/:restaurantId/:id',
  uploadPhoto.single('photo'),
  uploadPhotoRestaurantProductController.handle,
);

export { productsRoutes };
