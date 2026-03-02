import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Admin, adminModel } from "./admin.model.js"
import { omit } from "./admin.service.js"
import multer from "multer"
import { CarModel } from "../car/car.model.js"

export const loginAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(401).json({ error: "bad credentials" })
    }

    const admin = await adminModel.findOne({ username: username })

    if (!admin) {
        return res.status(401).json({ error: "bad credentials" })
    }

    const result = await admin.comparePassword(password)
    if (!result) {
        return res.status(401).json({ error: "bad credentials" })
    }
    const payload = jwt.sign(omit(admin, password), process.env.SECRET_KEY || "secret")
    return res.status(200).json({ payload })
}


const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName)
    }
})

export const upload = multer({ storage: storage })

export const createCar = async (req: Request, res: Response) => {
    const { name, transmission, fuel, price, className, category, location } = req.body

    if (!name || !transmission || !fuel || !price || !className || !category || !location || !req.files) {
        return res.status(400).json({ error: "all params are required" })
    }

    const files = req.files as Express.Multer.File[]



    const fileNames = files.map((f) => f.filename)
    console.log("uniqueName", req.file?.filename)

    await CarModel.create({
        images: fileNames,
        name: name,
        transmission,
        fuel,
        price,
        class: className,
        category,
        location
    })

    return res.status(201).send("created")

}

export const deleteCar = async (req: Request, res: Response) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ error: "all params are required" })
    }

    const car = await CarModel.findByIdAndDelete(id)

    return res.status(200).send("deleted!")

}


