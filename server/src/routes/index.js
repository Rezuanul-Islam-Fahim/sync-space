import express from 'express';
import { makeAuthRouter } from '../modules/auth/index.js';

const makeRoutes = ({ authController }) => {
    const router = express.Router();

    router.use('/auth', makeAuthRouter({ authController }));

    return router;
};

export default makeRoutes;
