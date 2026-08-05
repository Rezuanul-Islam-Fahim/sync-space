import { RegisterUserProfileUseCase } from './application/use-cases/register-user-profile.usecase.js';
import { RegistrationFacade } from './application/registration.facade.js';
import { RegistrationController } from './presentation/registration.controller.js';
import { createRegistrationRouter } from './presentation/registration.router.js';

/**
 * Composes the registration module dependencies and returns the Express router and registration facade.
 *
 * @param {{
 *   authService: import('../../modules/auth/index.js').AuthFacade,
 *   userService: import('../../modules/user/index.js').UserFacade,
 *   logger?: import('../../shared/ports/index.js').LoggerPort
 * }} deps
 * @returns {{
 *   router: import('express').Router,
 *   registrationService: import('./application/registration.facade.js').RegistrationFacade
 * }}
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

    const registrationService = new RegistrationFacade({
        registerUserProfileUseCase,
    });

    const registrationController = new RegistrationController({
        registrationService,
        logger,
    });

    const router = createRegistrationRouter({
        registrationController,
    });

    return {
        router,
        registrationService,
    };
};
