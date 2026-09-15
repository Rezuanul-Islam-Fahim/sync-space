export class GetBlacklistedLoginUseCase {
    constructor({ sessionReader }) {
        this.sessionReader = sessionReader;
    }

    async execute(jti) {
        return await this.sessionReader.getBlacklistedLoginSession(jti);
    }
}
