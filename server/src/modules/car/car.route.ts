import { Router } from "express";
import { getAllCars, getCarById, getCarsByLocationAndDate, getImage } from "./car.controller.js";
import { getCars } from "../../middleware/findCars.js";

export const carRoute = Router()

carRoute.post("/", getCars, getCarsByLocationAndDate)
carRoute.get("/images/:imgName", getImage)
carRoute.post("/find", getCarById)
carRoute.get("/", getAllCars)