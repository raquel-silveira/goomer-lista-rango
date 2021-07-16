import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';
import { AppError } from '../../errors/AppError';
import { router } from './routes';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
  return response.send('Hello, world! 💙');
});

app.use(cors());
app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);

export { app };
