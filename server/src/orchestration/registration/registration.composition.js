import { RegisterUserProfileSaga } from './registration.saga.js';
import { RegistrationController } from './presentation/registration.controller.js';
import { createRegistrationRouter } from './presentation/registration.router.js';

/**
 * Composes the registration orchestration components and returns the Express router.
 *
 * @param {{
 *   authService: import('../../modules/auth/application/auth.facade.js').AuthFacade,
 *   userService: import('../../modules/user/application/user.facade.js').UserFacade,
 *   logger?: import('../../shared/ports/index.js').LoggerPort
 * }} deps
 * @returns {{
 *   router: import('express').Router
 * }}
 */
export const composeRegistrationModule = ({
    authService,
    userService,
    logger,
}) => {
    const registrationSaga = new RegisterUserProfileSaga({
        authService,
        userService,
        logger,
    });

    const registrationController = new RegistrationController({
        registrationSaga,
        logger,
    });

    const router = createRegistrationRouter({
        registrationController,
    });

    return {
        router,
    };
};
