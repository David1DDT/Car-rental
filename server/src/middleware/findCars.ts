import type { NextFunction, Request, Response } from "express";
import { CarModel } from "../modules/car/car.model.js";
import { findCarsInDB } from "../modules/car/car.service.js";


interface findCarsInterface {
    startDate: Date,
    endDate: Date,
    loc: string
}

export const getCars = async (req: Request<{}, {}, findCarsInterface>, res: Response, next: NextFunction) => {
    const { startDate, endDate, loc } = req.body

    if (!startDate || !endDate || !loc) {
        return res.status(400).send("invalid params")
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    if (!(start.getTime() < end.getTime()) || start.getTime() < now.getTime()) {
        return res.status(400).send("invalid params")
    }
    res.locals.cars = await findCarsInDB(loc, endDate, startDate)
    next()
}

export const verifyCarAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const car = await CarModel.findById(req.body.id)
    console.log(car, res.locals.cars)
    if (!car || !res.locals.cars.some((c: any) => c._id.toString() === car._id.toString())) {
        return res.status(400).send("car not avalible")
    }
    next()
}