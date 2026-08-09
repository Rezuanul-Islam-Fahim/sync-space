import { maskEmail } from '../../../../shared/util/index.js';

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

        let savedUserProfile;
        try {
            // 2. Create User Profile
            savedUserProfile = await this.userService.createUser({
                authId: savedAuthUser.id,
                username: data.username,
                displayName: data.displayName ?? null,
                dateOfBirth: data.dateOfBirth,
            });
        } catch (err) {
            this.logger?.warn?.('Initiating saga rollback for auth user', {
                authUserId: savedAuthUser.id,
                error: err.message,
            });

            try {
                // Compensating action: rollback credential creation
                await this.authService.deleteAuthUser(savedAuthUser.id);
            } catch (rollbackErr) {
                this.logger?.error?.(
                    'CRITICAL: Saga rollback failed. Orphaned credential record.',
                    {
                        authUserId: savedAuthUser.id,
                        error: rollbackErr.message,
                    }
                );
            }
            throw err;
        }

        this.logger?.info?.(
            'User profile registration saga completed successfully',
            {
                authUserId: savedAuthUser.id,
                userId: savedUserProfile.id,
                email: maskEmail(savedAuthUser.email),
            }
        );

        return {
            authUser: savedAuthUser,
            userProfile: savedUserProfile,
        };
    }
}
