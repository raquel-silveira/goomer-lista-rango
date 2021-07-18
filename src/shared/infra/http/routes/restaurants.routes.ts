import { CreateRestaurantController } from '@modules/restaurants/useCases/createRestaurant/CreateRestaurantController';
import { DeleteRestaurantController } from '@modules/restaurants/useCases/deleteRestaurant/DeleteRestaurantController';
import { ListAllRestaurantsController } from '@modules/restaurants/useCases/listAllRestaurants/ListAllRestaurantsController';
import { ListOneRestaurantController } from '@modules/restaurants/useCases/listOneRestaurant/ListOneRestaurantController';
import { UpdateRestaurantController } from '@modules/restaurants/useCases/updateRestaurant/UpdateRestaurantController';
import { Router } from 'express';

const restaurantsRoutes = Router();

const listAllRestaurantController = new ListAllRestaurantsController();
const listOneRestaurantController = new ListOneRestaurantController();
const createRestaurantController = new CreateRestaurantController();
const updateRestaurantController = new UpdateRestaurantController();
const deleteRestaurantController = new DeleteRestaurantController();

restaurantsRoutes.get('/', listAllRestaurantController.handle);

restaurantsRoutes.get('/:id', listOneRestaurantController.handle);

restaurantsRoutes.post('/', createRestaurantController.handle);

restaurantsRoutes.put('/:id', updateRestaurantController.handle);

restaurantsRoutes.delete('/:id', deleteRestaurantController.handle);

export { restaurantsRoutes };
