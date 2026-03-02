import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const deserializeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(403).send("Unauthorised")
    }

    res.locals.admin = jwt.verify(token, process.env.SECRET_KEY || "secret")

    next()
}

export default deserializeAdmin