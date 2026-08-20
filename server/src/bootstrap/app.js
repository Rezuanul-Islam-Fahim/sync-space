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

let isMorganTokenRegistered = false;

const registerMorganTokens = () => {
    if (isMorganTokenRegistered) return;
    morgan.token('id', req => req.id || '-');
    isMorganTokenRegistered = true;
};

const devMorganFormat =
    ':method :url :status :response-time ms - :res[content-length] [reqId: :id]';
const prodMorganFormat =
    ':remote-addr - :remote-user [:date[clf]] [reqId: :id] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

/**
 * Creates and configures the Express application with middleware and routes.
 *
 * @param {{
 *   router: import('express').Router,
 *   logger: import('../shared/ports/index.js').LoggerPort,
 *   corsOrigins: string | string[],
 *   corsCredentials?: boolean,
 *   bodyLimit: string,
 *   trustProxy?: boolean,
 *   isDev: boolean
 * }} params
 * @returns {import('express').Application}
 */
export const createApp = ({
    router,
    logger,
    corsOrigins,
    corsCredentials,
    bodyLimit,
    trustProxy,
    isDev,
}) => {
    registerMorganTokens();

    const app = express();

    if (trustProxy) {
        app.set('trust proxy', trustProxy);
    }

    app.use(requestIdAttach);
    app.use(helmet());
    app.use(
        cors({
            origin: corsOrigins,
            credentials: corsCredentials,
        })
    );
    app.use(express.json({ limit: bodyLimit }));
    app.use(express.urlencoded({ extended: false, limit: bodyLimit }));
    app.use(hpp());

    const selectedMorganFormat = isDev ? devMorganFormat : prodMorganFormat;

    app.use(
        morgan(selectedMorganFormat, {
            stream: {
                write: message => logger.http(message.trim()),
            },
        })
    );

    app.use('/api', router);

    app.use(unknownRoutesHandler);
    app.use(makeErrorHandler({ logger, exposeStack: isDev }));

    return app;
};
