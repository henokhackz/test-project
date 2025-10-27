import express from 'express';
import type { Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.route.js';
import progressRoutes from './routes/progress.route.js';
import { errorHandler } from './middlewares/error.middleware.js';
import logger from './utils/logger.js';

dotenv.config();

const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

export default app;
