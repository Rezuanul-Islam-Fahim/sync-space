import express from 'express';
import { createApp } from './app.js';
import { composeUserModule } from './modules/user/index.js';
import { composeAuthModule } from './modules/auth/index.js';
import { RegistrationController } from './api/composite/registration.controller.js';
import { createRegistrationRouter } from './api/composite/registration.router.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * logger is required — callers must pass a fully-initialised LoggerPort
 * instance (typically created from the Joi-validated config.logLevel in
 * server.js).  No concrete logger is imported here to keep this file
 * infrastructure-agnostic and testable.
 *
 * @param {{ logger: import('./shared/ports/logger.port.js').LoggerPort }} deps
 */
export const composeDependencies = ({ logger }) => {
    // ── User bounded context ──────────────────────────────────────────────────
    const userModule = composeUserModule({ logger });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authModule = composeAuthModule({ logger });

    // ── Composite API layer ───────────────────────────────────────────────────
    const registrationController = new RegistrationController({
        authService: authModule.authService,
        userService: userModule.userService,
        logger,
    });

    const registrationRouter = createRegistrationRouter({
        registrationController,
    });

    // ── Middleware ────────────────────────────────────────────────────────────

    // ── Routing ───────────────────────────────────────────────────────────────
    const v1Router = express.Router();
    v1Router.use('/auth/register', registrationRouter);
    v1Router.use('/auth', authModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    const app = createApp({ router: apiRouter, logger });

    return app;
};
