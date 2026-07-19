import { catchAsync, ApiResponse } from '../../shared/util/index.js';
import { CREATED } from '../../shared/constant/index.js';
import { RegistrationResponseDto } from './dto/registration-response.dto.js';
import { USER_CREATED } from '../../modules/auth/presentation/auth.messages.js';

export class RegistrationController {
    constructor({ authService, userService, logger }) {
        this.authService = authService;
        this.userService = userService;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        // 1. Create Auth Credentials
        const savedAuthUser = await this.authService.registerUser({
            email: req.body.email,
            password: req.body.password,
        });

        try {
            // 2. Create User Profile
            await this.userService.createUser({
                id: savedAuthUser.id,
                email: savedAuthUser.email,
                username: req.body.username,
                displayName: req.body.displayName ?? null,
                dateOfBirth: req.body.dateOfBirth,
            });
        } catch (err) {
            // Compensating action: rollback credential creation
            await this.authService.deleteAuthUser(savedAuthUser.id);
            throw err;
        }

        const responseDto = RegistrationResponseDto.from(savedAuthUser);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}
