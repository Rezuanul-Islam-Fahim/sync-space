export class RegisterUserProfileUseCase {
    constructor({ authService, userService, logger }) {
        this.authService = authService;
        this.userService = userService;
        this.logger = logger;
    }

    async execute(data) {
        // 1. Create Auth Credentials
        const savedAuthUser = await this.authService.registerUser({
            email: data.email,
            password: data.password,
        });

        try {
            // 2. Create User Profile
            await this.userService.createUser({
                id: savedAuthUser.id,
                email: savedAuthUser.email,
                username: data.username,
                displayName: data.displayName ?? null,
                dateOfBirth: data.dateOfBirth,
            });
        } catch (err) {
            // Compensating action: rollback credential creation
            await this.authService.deleteAuthUser(savedAuthUser.id);
            throw err;
        }

        return savedAuthUser;
    }
}
