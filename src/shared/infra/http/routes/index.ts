import { Router } from 'express';

import { productsRoutes } from './products.routes';
import { restaurantsRoutes } from './restaurants.routes';

const router = Router();

router.use('/restaurants', restaurantsRoutes);
router.use('/products', productsRoutes);

export { router };
