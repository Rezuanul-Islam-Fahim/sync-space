import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import logger from './utils/logger.js';
import router from './routes/index.js';
import requestIdAttach from './middlewares/request-id.middleware.js';
import corsConfig from './config/cors.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import unknownRoutesHandler from './middlewares/unknown-routes.middleware.js';

const createApp = () => {
    const app = express();

    app.use(requestIdAttach);
    app.use(helmet());
    app.use(hpp());
    app.use(express.json({ limit: '10kb' }));
    app.use(morgan('combined', { stream: logger.stream }));
    app.use(cors(corsConfig));

    app.use('/api', router);

    app.use(unknownRoutesHandler);
    app.use(errorHandler);

    return app;
};

export default createApp;
