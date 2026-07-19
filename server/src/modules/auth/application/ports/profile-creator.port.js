export class ProfileCreatorPort {
    /**
     * Creates a user profile in the user-bounded context.
     *
     * Called synchronously from `RegisterUserUseCase` immediately after the
     * auth credentials have been persisted, ensuring both records are written
     * within the same registration flow.
     *
     * @param {{ userId: string, registrationData: object }} _params
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line no-unused-vars
    async createProfile({
        userId: _userId,
        registrationData: _registrationData,
    }) {
        throw new Error('Method not implemented');
    }
}
