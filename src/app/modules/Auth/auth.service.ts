import * as bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwtHelpers'; // Correctly import jwtHelpers
import { UserStatus } from '@prisma/client';
import config from '../../../config';

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const inCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!inCorrectPassword) {
        throw new Error("Password is incorrect");
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string);

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, 'abcdefghijklmnop');
    } catch (err) {
        throw new Error("You are not authorized");
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    if (!userData) {
        throw new Error("User not found");
    }

    const newAccessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken: newAccessToken,
        needPasswordChange: userData.needPasswordChange
    };
};

export const authServices = {
    loginUser,
    refreshToken // Ensure refreshToken is included in the export
};
