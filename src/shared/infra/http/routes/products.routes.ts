import { CreateRestaurantProductController } from '@modules/products/useCases/createRestaurantProduct/CreateRestaurantProductController';
import { DeleteRestaurantProductController } from '@modules/products/useCases/deleteRestaurantProduct/DeleteRestaurantProductController';
import { ListAllRestaurantProductsController } from '@modules/products/useCases/listAllRestaurantProducts/ListAllRestaurantProductsController';
import { UpdateRestaurantProductController } from '@modules/products/useCases/updateRestaurantProduct/UpdateRestaurantProductController';
import { Router } from 'express';

const productsRoutes = Router();

const listAllRestaurantProductsController =
  new ListAllRestaurantProductsController();
const createRestaurantProductController =
  new CreateRestaurantProductController();
const updateRestaurantProductController =
  new UpdateRestaurantProductController();
const deleteRestaurantProductController =
  new DeleteRestaurantProductController();

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

export { productsRoutes };
