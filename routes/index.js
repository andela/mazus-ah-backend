import express from 'express';
import authRoute from './authRoutes';

const routes = express.Router();

routes.use('/auth', authRoute);

export default routes;
