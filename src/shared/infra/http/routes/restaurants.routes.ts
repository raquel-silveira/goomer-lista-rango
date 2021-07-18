import { CreateRestaurantController } from '@modules/restaurants/useCases/createRestaurant/CreateRestaurantController';
import { ListAllRestaurantsController } from '@modules/restaurants/useCases/listAllRestaurants/ListAllRestaurantsController';
import { ListOneRestaurantController } from '@modules/restaurants/useCases/listOneRestaurant/ListOneRestaurantController';
import { UpdateRestaurantController } from '@modules/restaurants/useCases/updateRestaurant/UpdateRestaurantController';
import { Router } from 'express';

const restaurantsRoutes = Router();

const listAllRestaurantController = new ListAllRestaurantsController();
const listOneRestaurantController = new ListOneRestaurantController();
const createRestaurantController = new CreateRestaurantController();
const updateRestaurantController = new UpdateRestaurantController();

restaurantsRoutes.get('/', listAllRestaurantController.handle);

restaurantsRoutes.get('/:id', listOneRestaurantController.handle);

restaurantsRoutes.post('/', createRestaurantController.handle);

restaurantsRoutes.put('/:id', updateRestaurantController.handle);

restaurantsRoutes.delete('/:id', (request, response) => {
  response.status(201).json('oi');
});

restaurantsRoutes.patch('/photo/:id', (request, response) => {
  response.status(201).json('oi');
});

export { restaurantsRoutes };
