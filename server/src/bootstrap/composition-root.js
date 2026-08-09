import { createApp } from './app.js';
import { createApiRouter } from './routes.js';
import { composeUserModule } from '../modules/user/index.js';
import { composeAuthModule } from '../modules/auth/index.js';
import { composeRegistrationModule } from '../orchestration/registration/index.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * @param {{
 *   logger: import('../shared/ports/index.js').LoggerPort,
 *   config: object,
 *   connection?: import('mongoose').Connection
 * }} deps
 */
export const composeDependencies = ({ logger, config, connection }) => {
    // ── User bounded context ──────────────────────────────────────────────────
    const userModule = composeUserModule({
        logger,
        dbConnection: connection,
        autoIndex: config.db?.autoIndex,
    });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authModule = composeAuthModule({
        logger,
        authConfig: config.auth,
        jwtConfig: config.jwt,
        dbConnection: connection,
        autoIndex: config.db?.autoIndex,
    });

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
    const apiRouter = createApiRouter({
        registrationRouter: registrationModule.router,
        authRouter: authModule.router,
    });

    const app = createApp({
        router: apiRouter,
        logger,
        corsOrigins: config.corsOrigins,
        corsCredentials: config.corsCredentials,
        bodyLimit: config.bodyLimit,
        trustProxy: config.trustProxy,
        env: config.env,
        exposeStack: config.env === 'development',
    });

    return app;
};
