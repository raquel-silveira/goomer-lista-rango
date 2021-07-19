import { CreateProductController } from '@modules/products/useCases/createProduct/CreateProductController';
import { Router } from 'express';

const productsRoutes = Router();

const createProductController = new CreateProductController();

productsRoutes.post('/:restaurantId', createProductController.handle);

export { productsRoutes };
