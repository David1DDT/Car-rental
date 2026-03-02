
'use client'

import { useState, use, useEffect } from 'react'

interface CarData {
    _id: string
    name: string
    class: string
    category: string
    location: string
    price: number
    transmission: string
    fuel: string
    images: string[]
}

const CheckoutPage = ({ searchParams }: { searchParams: Promise<{ carId: string, startDate: string, endDate: string, loc: string }> }) => {
    const [customerType, setCustomerType] = useState<'physical' | 'juridical'>('physical')
    const [paymentType, setPaymentType] = useState<'online' | 'pickup'>('online')
    const [car, setCar] = useState<CarData | null>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: '',
        companyName: '',
        registrationNumber: '',
        address: '',
    })
    const [params, setParams] = useState<{ carId: string, startDate: string, endDate: string, loc: string } | null>(null)
    const { carId, startDate, endDate, loc } = use(searchParams)

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/find`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: carId })
                })
                const data = await response.json()
                setCar(data.car)
            } catch (error) {
                console.error("Error fetching car:", error)
            } finally {
                setLoading(false)
            }
        }
        if (carId) fetchCar()
    }, [carId])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const calculateFinalPrice = () => {
        if (!car || !startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return days * car.price
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.email || !formData.phone || !formData.name || (customerType === "juridical" && (!formData.companyName || !formData.registrationNumber))) {
            e.currentTarget.reportValidity()
            return
        }
        if (paymentType === "online") {
            const backendUrl = "http://localhost:4000"

            console.log({ ...formData, customerType, carId, startDate, endDate, loc })
            const response = await fetch(`${backendUrl}/order/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone,
                    name: formData.name,
                    address: formData.address,
                    companyName: formData.companyName,
                    registrationNumber: formData.registrationNumber,
                    customerType,
                    id: carId,
                    startDate,
                    endDate,
                    loc
                }),
            })
            const contentType = response.headers.get("content-type") || ""
            const data = contentType.includes("application/json")
                ? await response.json()
                : { message: await response.text() }

            if (!response.ok) {
                console.error("Error creating checkout session:", data)
                alert("Nu s-a putut crea sesiunea de plată. Verifică backend URL și endpoint-ul.")
                return
            }

            if (data.url) {
                console.log(data.url)
                window.location.href = data.url
            } else {
                console.error("Error creating checkout session:", data)
                alert("Error creating checkout session. Please try again.")
            }
        }
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-1 py-12 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Car Summary */}
                    {car && (
                        <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezumatul rezervării</h2>

                            <div className="space-y-4">
                                {/* Car Image */}
                                <div className="flex justify-center">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/images/${car.images?.[0] || ""}`}
                                        alt={car.name}
                                        className="w-full h-64 object-contain rounded-lg border border-gray-200"
                                    />
                                </div>

                                {/* Car Details */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
                                    <p className="text-gray-600 mb-4">{car.class} • {car.category}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <p className="text-xs text-gray-600 font-semibold">PERIOADA</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">
                                                {formatDate(startDate)} → {formatDate(endDate)}
                                            </p>
                                        </div>

                                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                            <p className="text-xs text-gray-600 font-semibold">📍 LOCAȚIE</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">{loc || car.location}</p>
                                        </div>

                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                            <p className="text-xs text-gray-600 font-semibold">PREȚ PE ZI</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">${car.price}/zi</p>
                                        </div>
                                    </div>

                                    {/* Final Price */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg text-white">
                                        <p className="text-sm font-semibold mb-1">PREȚ TOTAL</p>
                                        <p className="text-3xl font-bold">${calculateFinalPrice()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Plată</h1>
                            <p className="text-gray-600 text-sm mt-2">Completați detaliile rezervării</p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSumbit}>
                            {/* Customer Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">Tip de client</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" style={{ borderColor: customerType === 'physical' ? '#3b82f6' : '#e5e7eb', backgroundColor: customerType === 'physical' ? '#eff6ff' : 'transparent' }}>
                                        <input
                                            type="radio"
                                            value="physical"
                                            checked={customerType === 'physical'}
                                            onChange={(e) => setCustomerType(e.target.value as 'physical' | 'juridical')}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="ml-3 font-medium text-gray-900">Persoană fizică</span>
                                    </label>
                                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" style={{ borderColor: customerType === 'juridical' ? '#3b82f6' : '#e5e7eb', backgroundColor: customerType === 'juridical' ? '#eff6ff' : 'transparent' }}>
                                        <input
                                            type="radio"
                                            value="juridical"
                                            checked={customerType === 'juridical'}
                                            onChange={(e) => setCustomerType(e.target.value as 'physical' | 'juridical')}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="ml-3 font-medium text-gray-900">Persoană juridică</span>
                                    </label>
                                </div>
                            </div>

                            {/* Payment Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">Tip de plată</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" style={{ borderColor: paymentType === 'online' ? '#3b82f6' : '#e5e7eb', backgroundColor: paymentType === 'online' ? '#eff6ff' : 'transparent' }}>
                                        <input
                                            type="radio"
                                            value="online"
                                            checked={paymentType === 'online'}
                                            onChange={(e) => setPaymentType(e.target.value as 'online' | 'pickup')}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="ml-3 font-medium text-gray-900">Online cu cardul</span>
                                    </label>
                                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" style={{ borderColor: paymentType === 'pickup' ? '#3b82f6' : '#e5e7eb', backgroundColor: paymentType === 'pickup' ? '#eff6ff' : 'transparent' }}>
                                        <input
                                            type="radio"
                                            value="pickup"
                                            checked={paymentType === 'pickup'}
                                            onChange={(e) => setPaymentType(e.target.value as 'online' | 'pickup')}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="ml-3 font-medium text-gray-900">La ridicarea mașinii</span>
                                    </label>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Physical Person */}
                                {customerType === 'physical' && (
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nume complet"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-1 md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                )}

                                {/* Juridical Person */}
                                {customerType === 'juridical' && (
                                    <>
                                        <input
                                            type="text"
                                            name="companyName"
                                            placeholder="Denumirea companiei"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            required
                                            className="col-span-1 md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            placeholder="CUI"
                                            value={formData.registrationNumber}
                                            onChange={handleInputChange}
                                            required
                                            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </>
                                )}

                                {/* Email */}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Adresă de email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />

                                {/* Phone */}
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Număr de telefon"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />


                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            >
                                Plătește - ${calculateFinalPrice()}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage