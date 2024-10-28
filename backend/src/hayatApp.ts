import express from 'express';
import cors from 'cors';
import { configureAWS } from './config/hayatAwsConfig';
import { hayatB2cRouter } from './routes/hayatB2cRoutes';
import hayatB2bRouter from './routes/hayatB2bRoutes';
import { hayatB2eRouter } from './routes/hayatB2eRoutes';
import hayatAdminRouter from './routes/hayatAdminRoutes';

const app = express();
const port = process.env.PORT || 3001;

try {
  configureAWS();

  app.use(cors());
  app.use(express.json());

  app.use('/api/b2c', hayatB2cRouter);
  app.use('/api/b2b', hayatB2bRouter);
  app.use('/api/b2e', hayatB2eRouter);
  app.use('/api/admin', hayatAdminRouter);

  app.listen(port, () => {
    console.log(`Hayat ERP backend is running on port ${port}`);
  });
} catch (error) {
  console.error('Error starting Hayat ERP backend:', error);
}

export default app;
