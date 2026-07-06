import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import { config } from './config/index.js';
import {
    requestIdAttach,
    makeErrorHandler,
    unknownRoutesHandler,
} from './shared/index.js';

export const createApp = ({ router, logger, customNormalizers = [] }) => {
    const app = express();

    app.use(requestIdAttach);
    app.use(helmet());
    app.use(hpp());
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: false, limit: '10kb' }));
    app.use(morgan('combined', { stream: logger.stream }));
    app.use(
        cors({
            origin: config.corsOrigins,
            credentials: config.corsOrigins !== '*',
        })
    );

    app.use('/api', router);

    app.use(unknownRoutesHandler);
    app.use(makeErrorHandler(logger, customNormalizers));

    return app;
};
