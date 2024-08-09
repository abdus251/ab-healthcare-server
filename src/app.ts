import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { userRoutes } from './app/modules/User/user.routes';
import { AdminRoutes } from './app/modules/admin/admin.routes';
import router from './app/routes/index'

// D:\next-level\full-stack\ab-healthcare-server\src\app\routes\index.ts


const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ab health care server.."
    })
});

app.use('/api/v1', router)

export default app;