import { Router } from 'express';

import { CreateRestaurantController } from '../../../../modules/restaurants/useCases/createRestaurant/CreateRestaurantController';

const restaurantsRoutes = Router();

const createRestaurantController = new CreateRestaurantController();

restaurantsRoutes.get('/', (request, response) => {
  response.status(201).json('oi');
});

restaurantsRoutes.post('/', createRestaurantController.handle);

restaurantsRoutes.get('/:id', (request, response) => {
  response.status(201).json('oi');
});

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
