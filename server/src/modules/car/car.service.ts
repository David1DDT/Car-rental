import { CarModel } from "./car.model.js"

export const findCarsInDB = async (loc: string, endDate: Date, startDate: Date) => {
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

  return cars
}


