import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import {
    requestIdAttach,
    makeErrorHandler,
    unknownRoutesHandler,
} from '../shared/middleware/index.js';

morgan.token('id', req => req.id || '-');

const morganFormat =
    ':remote-addr - :remote-user [:date[clf]] [reqId: :id] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const createApp = ({
    router,
    logger,
    corsOrigins,
    corsCredentials,
    bodyLimit = '10kb',
    exposeStack = false,
}) => {
    const app = express();

    app.use(requestIdAttach);
    app.use(helmet());
    app.use(hpp());
    app.use(express.json({ limit: bodyLimit }));
    app.use(express.urlencoded({ extended: false, limit: bodyLimit }));
    app.use(
        morgan(morganFormat, {
            stream: {
                write: message => logger.http(message.trim()),
            },
        })
    );
    app.use(
        cors({
            origin: corsOrigins,
            credentials: corsCredentials,
        })
    );

    app.use('/api', router);

    app.use(unknownRoutesHandler);
    app.use(makeErrorHandler({ logger, exposeStack }));

    return app;
};
