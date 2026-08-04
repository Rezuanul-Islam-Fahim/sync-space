import express from 'express';

/**
 * Builds the API router hierarchy by mounting module routes.
 *
 * @param {{
 *   registrationModule: { router: import('express').Router },
 *   authModule: { router: import('express').Router }
 * }} modules
 * @returns {import('express').Router}
 */
export const createApiRouter = ({ registrationModule, authModule }) => {
    const v1Router = express.Router();
    v1Router.use('/auth/register', registrationModule.router);
    v1Router.use('/auth', authModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    return apiRouter;
};
