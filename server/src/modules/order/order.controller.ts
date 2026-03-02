import type { Request, Response } from "express"
import { CarModel } from "../car/car.model.js"
import { stripe } from "../../utils/stripe.js"
import { daysBetween } from "./order.service.js"
import { Order, orderModel } from "./order.model.js"


export const createOrder = async (req: Request, res: Response) => {
    const { startDate, endDate, loc, id, customerType, email, phone, name } = req.body
    const { d1, d2 } = { d1: new Date(startDate), d2: new Date(endDate) }
    if (!startDate || !endDate || !loc || !id || !email || !phone || !name) {
        return res.status(400).send("error all params are required")
    }
    const timeInterval = daysBetween(d1, d2)
    const car = await CarModel.findById(id)
    if (!car) {
        return res.status(400).send("invalid params")
    }
    if (customerType === "physical") {
        const order = await orderModel.create({
            customerType: customerType,
            person: {
                name: name,
                email: email,

                phone: phone
            },
            car: car,
            currency: "eur",
            plata: "fizic",
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

                phone: phone
            },
            car: car,
            currency: "eur",
            plata: "fizic",
            location: loc
        })
    } else {
        return res.status(400).send("invalid params")
    }

    return res.status(200).send("order created")
}


export const createCheckoutSession = async (req: Request, res: Response) => {
    const { startDate, endDate, loc, id, customerType, email, phone, name } = req.body

    const { d1, d2 } = { d1: new Date(startDate), d2: new Date(endDate) }
    if (!startDate || !endDate || !loc || !id || !email || !phone || !name) {
        return res.status(400).send("error all params are required")
    }

    const car = await CarModel.findById(id)
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
                        images: [`${process.env.BACKEND_URL}/api/cars/images/${car.images[0]}`]
                    },
                    unit_amount: car.price * 100
                },
                quantity: timeInterval
            }
        ],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    })

    console.log(session.amount_total)
    if (customerType === "physical") {
        const order = await orderModel.create({
            customerType: customerType,
            person: {
                name: name,
                email: email,

                phone: phone
            },
            car: car,
            currency: "eur",
            plata: "online",
            orderId: session.id,
            paymentStatus: "pending",
            location: loc,
            timeInterval: { startDate: d1, endDate: d2 },
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
        const car = await CarModel.findById(order.car._id)

        if (!car) {
            return res.status(400).send("invalid params")
        }
        car.reservations?.push(order.timeInterval)


        await order.save()
        await car.save()

    }
    res.status(200).send()
}