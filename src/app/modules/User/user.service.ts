import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";


const createAdmin = async(data: any) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await prisma.$transaction(async(transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        });

        const adminData = {
            name: data.admin.name,
            contactNumber: data.admin.contactNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: createdUserData.id,
        };

        const createdAdminData = await transactionClient.admin.create({
            data: adminData
        });

        return createdAdminData;
    });

    return result;
}

export const userService = {
    createAdmin
};
