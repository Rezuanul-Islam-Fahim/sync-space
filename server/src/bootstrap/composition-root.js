import express from 'express';
import { createApp } from './app.js';
import { getConfig } from '../config/index.js';
import { composeUserModule } from '../modules/user/index.js';
import { composeAuthModule, makeAuthenticate } from '../modules/auth/index.js';
import { composeRegistrationModule } from '../orchestration/registration/index.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * logger is required — callers must pass a fully-initialised LoggerPort
 * instance (typically created from the Joi-validated config.logLevel in
 * server.js).  No concrete logger is imported here to keep this file
 * infrastructure-agnostic and testable.
 *
 * @param {{ logger: import('../shared/ports/index.js').LoggerPort }} deps
 */
export const composeDependencies = ({ logger }) => {
    const config = getConfig();

    // ── User bounded context ──────────────────────────────────────────────────
    const userModule = composeUserModule({ logger });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authModule = composeAuthModule({ logger });

    // ── Middleware ────────────────────────────────────────────────────────────
    // eslint-disable-next-line no-unused-vars
    const authenticate = makeAuthenticate(authModule.authService);

    // ── Registration bounded context / Composite layer ────────────────────────
    const registrationModule = composeRegistrationModule({
        authService: authModule.authService,
        userService: userModule.userService,
        logger,
    });

    // ── Routing ───────────────────────────────────────────────────────────────
    const v1Router = express.Router();
    v1Router.use('/auth/register', registrationModule.router);
    v1Router.use('/auth', authModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    const app = createApp({
        router: apiRouter,
        logger,
        corsOrigins: config.corsOrigins,
        corsCredentials: config.corsCredentials,
        exposeStack: config.env === 'development',
    });

    return app;
};
