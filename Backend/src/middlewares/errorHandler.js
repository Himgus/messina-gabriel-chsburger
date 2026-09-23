import AppError from "../exceptions/AppError.js";
import { errorResponse } from "../responses/ApiResponse.js";
import { Messages } from "../enums/Messages.js";
import { HttpStatus } from "../enums/HttpStatus.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return errorResponse(res, err.message, err.statusCode);
    }
    if (err.type === "entity.parse.failed") {
        return errorResponse(res, Messages.INVALID_JSON, HttpStatus.BAD_REQUEST);
    }
    console.error(err);
    return errorResponse(res, Messages.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
};
