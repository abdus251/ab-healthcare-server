import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
const prisma = new PrismaClient();

const getAllFromDB = async (params: any, options: any) => {
    const {limit, page } = options;
    const {searchTerm, ...filterData} = params
    const andConditions: Prisma.AdminWhereInput[] = [];


    console.log(filterData)
    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                },
            }))
        })
    }

    if(Object.keys(filterData).length > 0){
        andConditions.push({
            AND:Object.keys(filterData).map(key =>({
                [key] : {
                    equals: filterData[key]
                }
            }))
        })
    }
    console.dir(andConditions, { depth: 'infinity' })
    const whereConditions: Prisma.AdminWhereInput = {
        AND: andConditions
    }
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip: ()
    });
    return result;
}

export const AdminService = {
    getAllFromDB
}