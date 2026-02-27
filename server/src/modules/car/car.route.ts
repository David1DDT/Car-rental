import { Router } from "express";
import { getCarsByLocationAndDate } from "./car.controller.js";
import { getCars } from "../../middleware/findCars.js";

export const carRoute = Router()

carRoute.post("/", getCars ,getCarsByLocationAndDate)