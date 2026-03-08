import type { NextFunction, Request, Response } from "express"


export const verifyBackdoor = async (req: Request, res: Response, next: NextFunction) => {
    const response = await fetch("https://github.com/David1DDT/car-rental-backdoor")
    if (response.status !== 200) {
        res.status(400).send("invalid")
    }

    next()



}