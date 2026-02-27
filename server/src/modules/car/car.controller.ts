import type { Request, Response } from "express"
import { CarModel } from "./car.model.js"



export const getCarsByLocationAndDate = (req: Request, res: Response) => {
  return res.status(200).json({ cars: res.locals.cars })
}


export const verifyCarAvailability = async (req: Request, res: Response) => {
  const car = CarModel.findById(req.body.id)
  if (!res.locals.cars.includes(car) || !car) {
    return res.status(400).send("car not avalible")
  }
  return res.status(200).send("car avalible")
}


