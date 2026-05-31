export default class ApiResponse {
    static success({ res, data, statusCode, message = 'OK' }) {
        return res.status(statusCode).json({ success: true, data, message })
    }
}
