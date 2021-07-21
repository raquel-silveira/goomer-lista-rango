import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../../../swagger.json';
import { productsRoutes } from './products.routes';
import { restaurantsRoutes } from './restaurants.routes';

const router = Router();

router.use('/restaurants', restaurantsRoutes);
router.use('/products', productsRoutes);
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export { router };
