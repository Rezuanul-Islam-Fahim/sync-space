/**
 * Wraps asynchronous Express middleware/route handlers to catch uncaught promise rejections
 * and forward errors to the Express global error handling middleware via `next(err)`.
 *
 * @param {Function} fn - Async Express middleware function (req, res, next) => Promise<any>
 * @returns {Function} Express middleware function
 */
export const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};
