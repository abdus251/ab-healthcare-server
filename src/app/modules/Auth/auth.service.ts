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
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
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
const changePassword = async (user: any, payload: any) => {
const userData = await prisma.user.findUniqueOrThrow({
    where: {
        email: user.email,
        status: UserStatus.ACTIVE
    }
});

const inCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!inCorrectPassword) {
        throw new Error("Password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

return {
    messag: "Password changed successfully!"
}

};
const forgotPassword = async (payload: {email: string}) => {
const userData = await prisma.user.findUniqueOrThrow({
    where: {
        email: payload.email,
        status: UserStatus.ACTIVE
    }
});

const resetPassToken = jwtHelpers.generateToken(
    {email: userData.email, role: userData.role},
config.jwt.reset_pass_secret as Secret,
config.jwt.reset_pass_token_expires_in as string
)
console.log(resetPassToken)

const resetPassLink = config.reset_pass_link + `?userId=${userData.email}&token=${resetPassToken}`

console.log(resetPassLink)
}

export const authServices = {
    loginUser,
    refreshToken,
    changePassword
};
