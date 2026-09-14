import { TimedOutError } from '../error/index.js';
import { sendSuccessResponse } from './api-response.util.js';
import { OK } from '../constants/http-status.constant.js';

export const waitedResponse = async ({
    waitingTime,
    pollInterval,
    resultCallback,
    res,
    message,
    errorMessage,
    constructData,
}) => {
    const now = Date.now();

    while (Math.floor((Date.now() - now) / 1000) < waitingTime) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const result = await resultCallback();

        if (result) {
            const data = constructData(result);

            return sendSuccessResponse({ res, data, OK, message });
        }
    }

    throw new TimedOutError(errorMessage);
};
