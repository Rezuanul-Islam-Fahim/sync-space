import express from 'express';

/**
 * Builds the API router hierarchy by mounting module routers.
 *
 * @param {{
 *   registrationRouter: import('express').Router,
 *   authRouter: import('express').Router
 * }} routers
 * @returns {import('express').Router}
 */
export const createApiRouter = ({ registrationRouter, authRouter }) => {
    const v1Router = express.Router();
    v1Router.use('/auth/register', registrationRouter);
    v1Router.use('/auth', authRouter);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    return apiRouter;
};
