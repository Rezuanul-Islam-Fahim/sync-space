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
};
