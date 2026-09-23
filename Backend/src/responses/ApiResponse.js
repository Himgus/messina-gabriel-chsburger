import { HttpStatus } from "../enums/HttpStatus.js";
export const successResponse = (res, data, statusCode = HttpStatus.OK) => {
    return res.status(statusCode).json({
        success: true,
        data
    });
};
export const errorResponse = (res, message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};
