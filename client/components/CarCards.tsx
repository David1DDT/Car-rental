"use client"

import { useEffect, useState } from "react"
import { Car } from "../../server/src/modules/car/car.model"


const CarCards = ({ startDate, endDate, location }: { startDate: string, endDate: string, location: string }) => {
    const [cars, setCars] = useState<Car[] | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startDate, endDate, loc: location }),
                });
                const data = await response.json();
                setCars(data?.cars);

            } catch (error) {
                console.error("Error fetching cars:", error)
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [startDate, endDate, location]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error loading cars. Please try again later.</p></div>;
    }
    return (
        <div className="flex flex-col gap-4 flex-wrap items-center my-10">
            {cars?.map((car, index) => (
                <div key={index} className="card w-150 bg-base-100 h-50 shadow-xl p-5">
                    <h3>{car.name}</h3>
                    <p>Location: {car.location}</p>

                    <p>Price: ${car.price}/day</p>

                    <a href={`/checkout?carId=${car._id}&startDate=${startDate}&endDate=${endDate}&loc=${location}`}>
                        <button className="btn btn-primary">Rent</button>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default CarCards