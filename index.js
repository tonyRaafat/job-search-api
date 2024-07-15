import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './src/modules/users/users.routers.js';
import companiesRoutes from './src/modules/companies/companies.routers.js'
import jobsRoutes from './src/modules/jobs/jobs.routers.js'
import { errorHandler } from './src/utils/errorhandler.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use('/users', usersRoutes);
app.use('/companies', companiesRoutes);
app.use('/jobs',jobsRoutes)

app.all('*', (req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
})

app.use(errorHandler)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
