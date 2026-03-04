"use client"

import { useEffect, useState } from "react"

interface CarModel {
    _id: string
    name: string
    transmission: string
    fuel: string
    price: number
    class: string
    category: string
    location: string
    images: string[]
}


const CarCards = ({ startDate, endDate, location }: { startDate: string, endDate: string, location: string }) => {
    const [cars, setCars] = useState<CarModel[] | null>(null)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-7xl mx-auto px-4">
            {cars?.map((car, index) => {
                const currentImage = car.images?.[0] || "";

                return (
                    <div key={index} className="card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                        {/* Image */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 w-full h-56">
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/images/${currentImage}`}
                                alt={car.name}
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                            />

                            {/* Category Badge */}
                            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {car.category}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-5 flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">Clasa: {car.class}</p>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">TRANSMISIE</p>
                                    <p className="text-sm font-bold text-gray-900">{car.transmission}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">COMBUSTIBIL</p>
                                    <p className="text-sm font-bold text-gray-900">{car.fuel}</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 col-span-2">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">📍 LOCATIE</p>
                                    <p className="text-sm font-bold text-gray-900">{car.location}</p>
                                </div>
                            </div>

                            {/* Price and Button */}
                            <div className="flex items-end justify-between border-t border-gray-200 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">PREȚ PE ZI</p>
                                    <p className="text-3xl font-bold text-blue-600">${car.price}</p>
                                </div>
                                <a href={`/checkout?carId=${car._id}&startDate=${startDate}&endDate=${endDate}&loc=${location}`}>
                                    <button className="btn btn-primary bg-blue-600 border-0 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-all">
                                        Închiriază acum
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default CarCards