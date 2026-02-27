import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import { connectToDatabase, disconnectDB } from "./utils/database.js"
import { carRoute } from "./modules/car/car.route.js"
import orderRouter from "./modules/order/order.route.js"


const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:3000"
}))
// Webhook route must come BEFORE body parsing middleware
app.use("/order", orderRouter)
// Apply body parsing middleware to all other routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/cars", carRoute)


const PORT = process.env.PORT || 4000

const server = app.listen(PORT, async () => {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
})


function gracefulShutdown(signal: string) {
    server.on(signal, async () => {
        server.close()

        console.log(`got ${signal}`)
        disconnectDB()

        process.exit(0)
    })
}

const signals: string[] = ["SIGTERM", "SIGINT"]


for (let signal of signals) {
    gracefulShutdown(signal)
}