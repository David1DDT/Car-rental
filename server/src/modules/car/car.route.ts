import { Router } from "express";
import { getCarsByLocationAndDate } from "./car.controller.js";

export const carRoute = Router()

carRoute.post("/", getCarsByLocationAndDate)