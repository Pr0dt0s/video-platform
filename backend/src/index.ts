import express from 'express';
import dotenv from 'dotenv';
import { setUpMiddleWares } from './middlewares';
import { createBaseRouter } from './routers';

dotenv.config();

const app = express();

setUpMiddleWares(app);

app.use('/api/v1', createBaseRouter());

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

export default app;
