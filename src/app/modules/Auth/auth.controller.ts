import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await authServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Token refreshed successfully",
        data: result
    });
});

export const AuthController = {
    loginUser,
    refreshToken
};
