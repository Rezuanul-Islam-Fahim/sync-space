/**
 * Polls a callback at regular intervals until a truthy result is returned or a timeout is reached.
 *
 * @param {object} options
 * @param {number} options.waitingTime - Maximum time to wait in seconds.
 * @param {number} options.pollInterval - Polling interval in milliseconds.
 * @param {() => Promise<any>} options.resultCallback - Async function returning the result.
 * @returns {Promise<any | null>} The result of the callback or null if timeout is reached.
 */
export const waitedResponse = async ({
    waitingTime,
    pollInterval,
    resultCallback,
}) => {
    const now = Date.now();

    while (Math.floor((Date.now() - now) / 1000) < waitingTime) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const result = await resultCallback();

        if (result) return result;
    }

    return null;
};
