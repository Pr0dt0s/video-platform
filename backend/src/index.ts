import express from 'express';
import dotenv from 'dotenv';
import { setUpMiddleWares } from './middlewares';

dotenv.config();

const app = express();

setUpMiddleWares(app);

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

export default app;
