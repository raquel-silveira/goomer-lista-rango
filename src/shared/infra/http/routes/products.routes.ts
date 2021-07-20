import { CreateRestaurantProductController } from '@modules/products/useCases/createRestaurantProduct/CreateRestaurantProductController';
import { ListAllRestaurantProductsController } from '@modules/products/useCases/listAllRestaurantProducts/listAllRestaurantProductsController';
import { UpdateRestaurantProductController } from '@modules/products/useCases/updateRestaurantProduct/UpdateRestaurantProductController';
import { Router } from 'express';

const productsRoutes = Router();

const listAllRestaurantProductsController =
  new ListAllRestaurantProductsController();
const createRestaurantProductController =
  new CreateRestaurantProductController();
const updateRestaurantProductController =
  new UpdateRestaurantProductController();

productsRoutes.get(
  '/:restaurantId',
  listAllRestaurantProductsController.handle,
);

productsRoutes.post('/:restaurantId', createRestaurantProductController.handle);

productsRoutes.put(
  '/:restaurantId/:id',
  updateRestaurantProductController.handle,
);

export { productsRoutes };
