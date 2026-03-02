import { Router } from "express";
import { getCarById, getCarsByLocationAndDate, getImage } from "./car.controller.js";
import { getCars } from "../../middleware/findCars.js";

export const carRoute = Router()

carRoute.post("/", getCars, getCarsByLocationAndDate)
carRoute.get("/images/:imgName", getImage)
carRoute.post("/find", getCarById)