import type { Request, Response } from "express"
import { CarModel } from "../car/car.model.js"
import { stripe } from "../../utils/stripe.js"
import { daysBetween } from "./order.service.js"
import { Order, orderModel } from "./order.model.js"



export const createCheckoutSession = async (req: Request, res: Response) => {
    const { startDate, endDate, loc, carId, customerType, email, phone, name, address } = req.body

    const { d1, d2 } = { d1: new Date(startDate), d2: new Date(endDate) }
    if (!startDate || !endDate || !loc || !carId || !email || !phone || !name || !address) {
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
    if (customerType === "physical") {
        const order = await orderModel.create({
            customerType: customerType,
            person: {
                name: name,
                email: email,
                address: address,
                phone: phone
            },
            car: car,
            currency: "eur",
            plata: "online",
            orderId: session.id,
            paymentStatus: "pending",
            location: loc,
            timeInterval: { startDate: d1, endDate: d2 }
        })
    } else if (customerType === "juridical") {
        const registrationNumber = req.body.registrationNumber
        if (!registrationNumber) {
            res.status(400).send("invalid request")
        }
        const order = await orderModel.create({
            customerType: customerType,
            person: {
                companyName: name,
                registrationNumber: registrationNumber,
                email: email,
                address: address,
                phone: phone
            },
            car: car,
            currency: "eur",
            plata: "online",
            orderId: session.id,
            paymentStatus: "pending",
            location: loc
        })
    } else {
        return res.status(400).send("invalid params")
    }

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
    console.log(event.type)
    console.log(event.data)
    if (event.type === "checkout.session.completed") {
        // @ts-ignore
        const orderId = event.data.object.id

        const order = await orderModel.findOne({ orderId: orderId })
        if (!order) {
            return res.status(400).send("invalid request")
        }

        order.paymentStatus = "paid"
        await order.save()

    }
    res.status(200).send()
}