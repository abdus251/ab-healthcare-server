import * as bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import jwt from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwtHelpers'; // Correctly import jwtHelpers

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
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
    "abcdefg", // Replace with your actual secret
    "5m"
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
    "abcdefghijklmnop", // Replace with your actual secret
    "30d"
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async(token:string)=>{
    console.log('refreshToken ', token)
}

export const authServices = {
    loginUser
};
