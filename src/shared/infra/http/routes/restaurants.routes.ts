import { ListAllRestaurantsController } from '@modules/restaurants/useCases/listAllRestaurants/ListAllRestaurantsController';
import { Router } from 'express';

import { CreateRestaurantController } from '../../../../modules/restaurants/useCases/createRestaurant/CreateRestaurantController';
import { ListOneRestaurantController } from '../../../../modules/restaurants/useCases/listOneRestaurant/ListOneRestaurantController';

const restaurantsRoutes = Router();

const listAllRestaurantController = new ListAllRestaurantsController();
const listOneRestaurantController = new ListOneRestaurantController();
const createRestaurantController = new CreateRestaurantController();

restaurantsRoutes.get('/', listAllRestaurantController.handle);

restaurantsRoutes.get('/:id', listOneRestaurantController.handle);

restaurantsRoutes.post('/', createRestaurantController.handle);

restaurantsRoutes.put('/:id', (request, response) => {
  response.status(201).json('oi');
});

restaurantsRoutes.delete('/:id', (request, response) => {
  response.status(201).json('oi');
});

restaurantsRoutes.patch('/photo/:id', (request, response) => {
  response.status(201).json('oi');
});

export { restaurantsRoutes };
