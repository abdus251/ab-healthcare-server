import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status';




const getAllFromDB = async (req: Request, res: Response) => {
    try {
        // console.log(req.query)
        const filters = pick(req.query, adminFilterableFields)
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        console.log(options)

        const result = await AdminService.getAllFromDB(filters, options)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data fetched!",
            meta: result.meta,
            data: result.data
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong",
            error: err
        })
    }
};
const getByIdFromDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await AdminService.getByIdFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data fetched by Id",
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong",
            error: err
        })
    }
};


const updateIntoDB = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await AdminService.updateIntoDB(id, req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data updated",
            data: result
        })
    }
    catch (err) {
    
    }
};

const deleteFromDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await AdminService.deleteFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data deleted",
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong",
            error: err
        })
    }
};


const softDeleteFromDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await AdminService.softDeleteFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data deleted",
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong",
            error: err
        })
    }
};
export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}