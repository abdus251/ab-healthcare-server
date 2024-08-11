import express, { NextFunction, Request, Response } from 'express'; // Import Request and Response types
import { AdminController } from './admin.controller';
import { AnyZodObject, z } from "zod";
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

const update = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
});

const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body
            });
            return next();
        } catch (err) {
            next(err);
        }
    };
};

router.get(
    '/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllFromDB
);

router.get(
    '/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getByIdFromDB
);

router.patch(
    '/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(update), // Use the `update` schema defined above
    AdminController.updateIntoDB
);

router.delete(
    '/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.deleteFromDB
);

router.delete(
    '/soft/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.softDeleteFromDB
);

export const AdminRoutes = router;
