import express from 'express';
import b2cRoutes from './routes/b2cRoutes';
import b2bRoutes from './routes/b2bRoutes';
import adminRoutes from './routes/adminRoutes';
import b2eRoutes from './routes/b2eRoutes';

const app = express();

app.use('/api/b2c', b2cRoutes);
app.use('/api/b2b', b2bRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/b2e', b2eRoutes);

export default app;
