import type { Request, Response } from "express"
import { CarModel } from "./car.model.js"

interface findCarsInterface {
    startDate: Date,
    endDate: Date,
    loc: string
}

export const getCarsByLocationAndDate = async (req: Request<{}, {}, findCarsInterface>, res: Response) => {
    const {startDate, endDate, loc} = req.body

    if (!startDate || !endDate ||  !loc ){
        return res.status(500).send("invalid params")
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
if (!(start.getTime() < end.getTime()) || !(start.getTime() < now.getTime())){}
      const cars = await CarModel.find({
    location: loc,
    $or: [
      { reservations: { $exists: false } },
      { reservations: { $size: 0 } },
      {
        reservations: {
          $not: {
            $elemMatch: {
              startDate: { $lte: endDate },
              endDate: { $gte: startDate }
            }
          }
        }
      }
    ]
  })
    
  return res.status(200).json({cars})
    
}