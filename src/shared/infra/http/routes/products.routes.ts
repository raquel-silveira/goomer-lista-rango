import { CreateRestaurantProductController } from '@modules/products/useCases/createRestaurantProduct/CreateRestaurantProductController';
import { ListAllRestaurantProductsController } from '@modules/products/useCases/listAllRestaurantProducts/listAllRestaurantProductsController';
import { Router } from 'express';

const productsRoutes = Router();

const listAllRestaurantProductsController =
  new ListAllRestaurantProductsController();
const createRestaurantProductController =
  new CreateRestaurantProductController();

productsRoutes.get(
  '/:restaurantId',
  listAllRestaurantProductsController.handle,
);
productsRoutes.post('/:restaurantId', createRestaurantProductController.handle);

export { productsRoutes };
