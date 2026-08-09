/**
 * Public API Facade for the Registration Orchestration Context.
 * Acts as the entry point for orchestrating multi-module user registration flows.
 */
export class RegistrationFacade {
    /**
     * @param {{
     *   registerUserProfileUseCase: import('./use-cases/register-user-profile.usecase.js').RegisterUserProfileUseCase
     * }} deps
     */
    constructor({ registerUserProfileUseCase }) {
        this.registerUserProfileUseCase = registerUserProfileUseCase;
    }

    /**
     * Orchestrates user credential registration and profile creation.
     *
     * @param {object} registrationData
     * @returns {Promise<{ authUser: object, userProfile: object }>}
     */
    registerUser(registrationData) {
        return this.registerUserProfileUseCase.execute(registrationData);
    }
}
