import express from 'express';
import AuthController from './auth.controller.js';
import { loginValidation, registerValidation } from './auth.validator.js';
import validate from '../../middlewares/validate.middleware.js';
import { loginUserUseCase, registerUserUseCase } from './usecases/index.js';

const router = express.Router();

const authController = new AuthController({
    loginUserUseCase,
    registerUserUseCase,
});

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

export default router;
