import express from 'express';
import { makeAuthUseCases, makeAuthRouter } from '../modules/auth/index.js';
import { userRepository } from '../modules/user/index.js';

const router = express.Router();

const authUseCases = makeAuthUseCases({ userRepository });

router.use('/auth', makeAuthRouter(authUseCases));

export default router;
