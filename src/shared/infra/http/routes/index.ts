import { Router } from 'express';

import { restaurantsRoutes } from './restaurants.routes';

const router = Router();

router.use('/restaurants', restaurantsRoutes);

export { router };
