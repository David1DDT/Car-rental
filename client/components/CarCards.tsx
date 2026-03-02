"use client"

import { useEffect, useState } from "react"
import { Car } from "../../server/src/modules/car/car.model"


const CarCards = ({ startDate, endDate, location }: { startDate: string, endDate: string, location: string }) => {
    const [cars, setCars] = useState<Car[] | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
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

    const handlePrevImage = (carIndex: number, totalImages: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [carIndex]: (prev[carIndex] || 0) === 0 ? totalImages - 1 : (prev[carIndex] || 0) - 1
        }));
    };

    const handleNextImage = (carIndex: number, totalImages: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [carIndex]: (prev[carIndex] || 0) === totalImages - 1 ? 0 : (prev[carIndex] || 0) + 1
        }));
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-7xl mx-auto px-4">
            {cars?.map((car, index) => {
                const imageCount = car.images?.length || 0;
                const currentIdx = currentImageIndex[index] || 0;
                const currentImage = car.images?.[currentIdx] || "";

                return (
                    <div key={index} className="card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                        {/* Image Carousel */}
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

                            {/* Carousel Controls */}
                            {imageCount > 1 && (
                                <>
                                    <button
                                        onClick={() => handlePrevImage(index, imageCount)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all font-bold text-lg"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={() => handleNextImage(index, imageCount)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all font-bold text-lg"
                                    >
                                        ›
                                    </button>

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                        {Array.from({ length: imageCount }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: i }))}
                                                className={`rounded-full transition-all ${i === currentIdx ? "bg-white w-8 h-2" : "bg-white/50 w-2 h-2 hover:bg-white/70"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-5 flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">Class: {car.class}</p>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">TRANSMISSION</p>
                                    <p className="text-sm font-bold text-gray-900">{car.transmission}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">FUEL</p>
                                    <p className="text-sm font-bold text-gray-900">{car.fuel}</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 col-span-2">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">📍 LOCATION</p>
                                    <p className="text-sm font-bold text-gray-900">{car.location}</p>
                                </div>
                            </div>

                            {/* Price and Button */}
                            <div className="flex items-end justify-between border-t border-gray-200 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">PRICE PER DAY</p>
                                    <p className="text-3xl font-bold text-blue-600">${car.price}</p>
                                </div>
                                <a href={`/checkout?carId=${car._id}&startDate=${startDate}&endDate=${endDate}&loc=${location}`}>
                                    <button className="btn btn-primary bg-blue-600 border-0 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-all">
                                        Rent Now
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