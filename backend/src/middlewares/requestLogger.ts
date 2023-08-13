import { randomUUID } from 'crypto';
import { Application, Request } from 'express';
import morgan from 'morgan';

const requestLogger = (app: Application) => {
    morgan.token('id', (req: Request) => req.id);

    app.use((req, _res, next) => {
        req.id = randomUUID();
        next();
    }, morgan('#:id :method :url :status :response-time ms - :res[content-length]'));
};
export default requestLogger;
