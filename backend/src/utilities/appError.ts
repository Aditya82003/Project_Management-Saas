import { HTTPSTATUS, HttpStatusCodeType } from "../config/https.config";
import {ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enums";

export class AppError extends Error{
    public statusCode:HttpStatusCodeType
    public errorCode?:ErrorCodeEnumType

    constructor(
        message:string,
        statusCode:HttpStatusCodeType,
        errorCode?:ErrorCodeEnumType
    ){
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        Error.captureStackTrace(this, this.constructor)
    }
}

export class HttpException extends AppError{
    constructor(
        message:"http exception eerror",
        statusCode:HttpStatusCodeType,
        errorCode?:ErrorCodeEnumType
    ){
        super(message, statusCode, errorCode)
    }
}

export class InternalServerException extends AppError{
    constructor(
        message:"internal server error",
        errorCode?:ErrorCodeEnumType
    ){
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR)
    }
}

export class NotFoundException extends AppError{
    constructor(
        message:"Resource not found",
        errorCode?:ErrorCodeEnumType
    ){
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND)
    }
}

export class BadRequestException extends AppError{
    constructor(
        message:"Bad request",
        errorCode?:ErrorCodeEnumType
    ){
        super(message, HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCodeEnum.VALIDATION_ERROR)
    }
}

export class UnauthorizedException extends AppError{
    constructor(
        message:"Unauthorized",
        errorCode?:ErrorCodeEnumType
    ){
        super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED)
    }
}