import { RegisterUserProfileUseCase } from './application/use-cases/register-user-profile.usecase.js';
import { RegistrationController } from './presentation/registration.controller.js';
import { createRegistrationRouter } from './presentation/registration.router.js';

/**
 * Composes the registration module dependencies and returns the Express router.
 *
 * @param {{
 *   authService: import('../../modules/auth/index.js').AuthFacade,
 *   userService: import('../../modules/user/index.js').UserFacade,
 *   logger?: import('../../shared/ports/index.js').LoggerPort
 * }} deps
 * @returns {{ router: import('express').Router }}
 */
export const composeRegistrationModule = ({
    authService,
    userService,
    logger,
}) => {
    const registerUserProfileUseCase = new RegisterUserProfileUseCase({
        authService,
        userService,
        logger,
    });

    const registrationController = new RegistrationController({
        registerUserProfileUseCase,
        logger,
    });

    const router = createRegistrationRouter({
        registrationController,
    });

    return { router };
};
