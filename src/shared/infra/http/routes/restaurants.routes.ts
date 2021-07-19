import { upload } from '@config/upload';
import { CreateRestaurantController } from '@modules/restaurants/useCases/createRestaurant/CreateRestaurantController';
import { DeleteRestaurantController } from '@modules/restaurants/useCases/deleteRestaurant/DeleteRestaurantController';
import { ListAllRestaurantsController } from '@modules/restaurants/useCases/listAllRestaurants/ListAllRestaurantsController';
import { ListOneRestaurantController } from '@modules/restaurants/useCases/listOneRestaurant/ListOneRestaurantController';
import { UpdateRestaurantController } from '@modules/restaurants/useCases/updateRestaurant/UpdateRestaurantController';
import { UploadPhotoRestaurantController } from '@modules/restaurants/useCases/uploadPhotoRestaurant/UploadPhotoRestaurantController';
import { Router } from 'express';
import multer from 'multer';

const restaurantsRoutes = Router();

const uploadPhoto = multer(upload.multer);

const listAllRestaurantController = new ListAllRestaurantsController();
const listOneRestaurantController = new ListOneRestaurantController();
const createRestaurantController = new CreateRestaurantController();
const updateRestaurantController = new UpdateRestaurantController();
const deleteRestaurantController = new DeleteRestaurantController();
const uploadPhotoRestaurantController = new UploadPhotoRestaurantController();

restaurantsRoutes.get('/', listAllRestaurantController.handle);

restaurantsRoutes.get('/:id', listOneRestaurantController.handle);

restaurantsRoutes.post('/', createRestaurantController.handle);

restaurantsRoutes.put('/:id', updateRestaurantController.handle);

restaurantsRoutes.delete('/:id', deleteRestaurantController.handle);

restaurantsRoutes.patch(
  '/photo/:id',
  uploadPhoto.single('photo'),
  uploadPhotoRestaurantController.handle,
);

export { restaurantsRoutes };
