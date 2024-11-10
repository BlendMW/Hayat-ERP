import express from 'express';
import cors from 'cors';
import { configureAWS } from './config/hayatAwsConfig';
import hayatB2bRouter from './routes/hayatB2bRoutes';
import hayatAdminRouter from './routes/hayatAdminRoutes';

const app = express();
const port = process.env.PORT || 3001;

try {
  configureAWS();

  app.use(cors());
  app.use(express.json());

  // Mount routers
  app.use('/api/b2b', hayatB2bRouter);
  app.use('/api/admin', hayatAdminRouter);

  app.listen(port, () => {
    console.log(`Hayat ERP backend is running on port ${port}`);
  });
} catch (error) {
  console.error('Error starting Hayat ERP backend:', error);
}

export default app;
