import { Router } from "express"
import type { Request, Response } from "express";
import deserializeAdmin from "../../middleware/deserializeAdmin.js";
import { createCar, deleteCar, loginAdmin, upload } from "./admin.controller.js";



export const adminRouter = Router()


adminRouter.post('/upload-car', deserializeAdmin, upload.array('images', 10), createCar)
adminRouter.delete('/delete-car', deserializeAdmin, deleteCar)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/me', deserializeAdmin, (req: Request, res: Response) => {
    return res.json({ admin: res.locals.admin })
})

