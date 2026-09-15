/**
 * Application Data Transfer Object representing verified access token claims
 * across bounded context boundaries.
 */
export class AccessTokenClaimsDto {
    constructor({ id, email }) {
        this.id = id;
        this.email = email;

        Object.freeze(this);
    }

    /**
     * Creates an AccessTokenClaimsDto from verified token claims or payload.
     *
     * @param {{ id: string, email: string }} claims
     * @returns {AccessTokenClaimsDto | null}
     */
    static fromClaims(claims) {
        if (!claims) return null;
        return new AccessTokenClaimsDto({
            id: claims.id,
            email: claims.email,
        });
    }
}
