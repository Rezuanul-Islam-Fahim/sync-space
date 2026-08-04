import express from 'express';
import { createApp } from './app.js';
import { composeUserModule } from '../modules/user/index.js';
import { composeAuthModule } from '../modules/auth/index.js';
import { composeRegistrationModule } from '../orchestration/registration/index.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * @param {{
 *   logger: import('../shared/ports/index.js').LoggerPort,
 *   config: object
 * }} deps
 */
export const composeDependencies = ({ logger, config }) => {
    // ── User bounded context ──────────────────────────────────────────────────
    const userModule = composeUserModule({ logger });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authModule = composeAuthModule({ logger, config });

    // ── Middleware ────────────────────────────────────────────────────────────
    // Authentication middleware factory is exported from the auth module
    // but not applied globally here; routes should explicitly opt in.

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
