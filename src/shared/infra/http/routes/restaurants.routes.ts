import { Router } from 'express';

const restaurantsRoutes = Router();

restaurantsRoutes.get('/', (request, response) => {
  response.status(201).json('oi');
});

restaurantsRoutes.post('/', (request, response) => {
  response.status(201).json('oi');
});

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
