import { catchAsync, ApiResponse } from '../../shared/util/index.js';
import { CREATED } from '../../shared/constant/index.js';
import {
    RegisterRequestDto,
    AuthUserResponseDto,
} from '../../modules/auth/presentation/dto/index.js';
import { USER_CREATED } from '../../modules/auth/presentation/auth.messages.js';

export class RegistrationController {
    constructor({
        registerUserUseCase,
        deleteAuthUserUseCase,
        createUserUseCase,
        logger,
    }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const requestDto = RegisterRequestDto.from(req.body);

        // 1. Create Auth Credentials
        const savedAuthUser =
            await this.registerUserUseCase.execute(requestDto);

        try {
            // 2. Create User Profile
            await this.createUserUseCase.execute({
                id: savedAuthUser.id,
                email: savedAuthUser.email,
                username: req.body.username,
                displayName: req.body.displayName ?? null,
                dateOfBirth: req.body.dateOfBirth,
            });
        } catch (err) {
            // Compensating action: rollback credential creation
            await this.deleteAuthUserUseCase.execute(savedAuthUser.id);
            throw err;
        }

        const responseDto = AuthUserResponseDto.from(savedAuthUser);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}
