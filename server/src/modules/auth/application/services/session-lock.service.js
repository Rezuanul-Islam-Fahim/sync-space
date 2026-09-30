import { randomUUID } from 'node:crypto';
import { TimedOutError } from '../../../../shared/error/index.js';
import {
    GET_CACHED_SESSION_POLLING_INTERVAL,
    GET_CACHED_SESSION_WAITING_TIME,
    TOKEN_REFRESH_TIMEOUT,
} from '../../domain/auth-user.constant.js';
import { waitedResponse } from '../../../../shared/util/index.js';

/**
 * Service responsible for distributed session lock management and concurrent request deduplication.
 */
export class SessionLockService {
    /**
     * @param {{
     *   sessionRefreshLock: import('../ports/session-refresh-lock.port.js').SessionRefreshLockPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ sessionRefreshLock, logger }) {
        this.sessionRefreshLock = sessionRefreshLock;
        this.logger = logger;
    }

    /**
     * Acquires a distributed lock for refreshing a token session.
     *
     * @param {string} lockKey
     * @param {string} lockValue
     * @returns {Promise<boolean>}
     */
    async acquireLock(lockKey, lockValue) {
        return this.sessionRefreshLock.acquireLock(lockKey, lockValue);
    }

    /**
     * Releases a distributed lock safely, logging any failure.
     *
     * @param {string} lockKey
     * @param {string} lockValue
     * @returns {Promise<void>}
     */
    async releaseLock(lockKey, lockValue) {
        try {
            await this.sessionRefreshLock.releaseLock(lockKey, lockValue);
        } catch (releaseError) {
            this.logger?.warn(
                'Failed to release session refresh lock in finally block',
                {
                    lockKey,
                    lockValue,
                    error: releaseError.message,
                }
            );
        }
    }

    /**
     * Retrieves a temporarily cached session generated during concurrent token refresh.
     *
     * @param {string} lockKey
     * @returns {Promise<{ accessToken: string, refreshToken: string } | null>}
     */
    async getCachedSession(lockKey) {
        return this.sessionRefreshLock.getCachedSession(lockKey);
    }

    /**
     * Temporarily caches the newly generated session to serve concurrent refresh requests.
     *
     * @param {string} lockKey
     * @param {string} accessToken
     * @param {string} refreshToken
     * @returns {Promise<void>}
     */
    async cacheSession(lockKey, accessToken, refreshToken) {
        await this.sessionRefreshLock.cacheSession(
            lockKey,
            accessToken,
            refreshToken
        );
    }

    /**
     * Polls for a cached session until available or timeout occurs.
     *
     * @param {string} lockKey
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async waitForCachedSession(lockKey) {
        const cachedSessionResult = await waitedResponse({
            waitingTime: GET_CACHED_SESSION_WAITING_TIME,
            pollInterval: GET_CACHED_SESSION_POLLING_INTERVAL,
            resultCallback: async () =>
                await this.sessionRefreshLock.getCachedSession(lockKey),
        });

        if (!cachedSessionResult) {
            throw new TimedOutError(TOKEN_REFRESH_TIMEOUT);
        }

        return {
            accessToken: cachedSessionResult.accessToken,
            refreshToken: cachedSessionResult.refreshToken,
        };
    }

    /**
     * Executes an operation within a distributed lock.
     * If the lock cannot be acquired, polls for the concurrent operation's cached result.
     *
     * @param {string} lockKey
     * @param {() => Promise<{ accessToken: string, refreshToken: string }>} action
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async withLock(lockKey, action) {
        const lockValue = randomUUID();

        try {
            const locked = await this.acquireLock(lockKey, lockValue);

            if (!locked) {
                return await this.waitForCachedSession(lockKey);
            }

            return await action();
        } finally {
            await this.releaseLock(lockKey, lockValue);
        }
    }
}
