import { Router } from "express";
import { createCheckoutSession, createOrder, webhookHandler } from "./order.controller.js";
import { getCars, verifyCarAvailability } from "../../middleware/findCars.js";
import express from "express"

const orderRouter = Router()

orderRouter.post("/create-checkout-session", express.json(), getCars, verifyCarAvailability, createCheckoutSession)
orderRouter.post(
    "/webhook",
    express.raw({ type: "application/json" }), // must be exact
    webhookHandler
)
orderRouter.post("/create-order", express.json(), getCars, verifyCarAvailability, createOrder)

export default orderRouter 