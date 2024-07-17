import express from 'express';

import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

//TODO logger

export default app;
