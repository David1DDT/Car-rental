import type { Request, Response } from "express"
import { CarModel } from "./car.model.js"
import path from "path"


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


export const getImage = async (req: Request, res: Response) => {
  const { imgName } = req.params
  if (!imgName) return res.status(400).send("no imageID")
  const img = path.resolve("uploads", imgName as string)
  res.sendFile(img)
}

export const getCarById = async (req: Request, res: Response) => {
  const id = req.body.id
  if (!id) {
    return res.status(400).send("invalid params")
  }

  return res.json({ car: await CarModel.findById(id) })
}

export const getAllCars = async (req: Request, res: Response) => {
  const cars = await CarModel.find()

  return res.status(200).json({ cars })
}