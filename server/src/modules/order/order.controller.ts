import type { Request, Response } from "express"
import { CarModel } from "../car/car.model.js"
import { stripe } from "../../utils/stripe.js"
import { daysBetween } from "./order.service.js"
import { orderModel } from "./order.model.js"



export const createCheckoutSession = async (req: Request, res: Response) => {
    const { startDate, endDate, loc, carId } = req.body

    const { d1, d2 } = { d1: new Date(startDate), d2: new Date(endDate) }
    if (!startDate || !endDate || !loc || !carId) {
        return res.status(400).send("error all params are required")
    }

    const car = await CarModel.findById(carId)
    const timeInterval = daysBetween(d1, d2)
    if (!car) {
        return res.status(400).send("invalid params")
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: car.name,
                        images: car.images
                    },
                    unit_amount: car.price * 100
                },
                quantity: timeInterval
            }
        ],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    })
    console.log(session.id)
    res.json({ url: session.url })
}


export const webhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"]
    console.log(Buffer.isBuffer(req.body)); // should log: true
    const event = stripe.webhooks.constructEvent(
        req.body,
        sig as any,
        process.env.STRIPE_WEBHOOK_SECRET || "key"
    )

    if (event.context === "charge.succeeded") {
        // @ts-ignore
        const orderId = event.data.object["payement_details"]["order_reference"]

        const order = await orderModel.find({ orderId: orderId })
        if (!order) {
            return res.status(400).send("invalid request")
        }
        order.payementStatus = "paid"

    }
    res.status(200).send()
}