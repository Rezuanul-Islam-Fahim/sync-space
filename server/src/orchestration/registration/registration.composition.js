import { RegisterUserProfileUseCase } from './application/use-cases/register-user-profile.usecase.js';
import { RegistrationController } from './presentation/registration.controller.js';
import { createRegistrationRouter } from './presentation/registration.router.js';

/**
 * Composes the registration module dependencies and returns the router and use-case.
 *
 * @param {{
 *   authService: import('../../modules/auth/application/auth.facade.js').AuthFacade,
 *   userService: import('../../modules/user/application/user.facade.js').UserFacade,
 *   logger?: import('../../shared/ports/logger.port.js').LoggerPort
 * }} deps
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
