'use client'

import { useEffect, useRef, useState } from "react"

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


const AdminPage = () => {
    const [cars, setCars] = useState<CarModel[] | null>(null)
    const [admin, setAdmin] = useState<object | null>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const fileRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const transmissionRef = useRef<HTMLSelectElement>(null)
    const fuelRef = useRef<HTMLSelectElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const classNameRef = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLSelectElement>(null)

    const deleteClickHandler = async (_carId: string) => {
        if (!confirm("Esti sigur ca vrei sa stergi aceasta masina?")) {
            return
        }


        const token = await cookieStore.get("token")
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/admin/delete-car`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token?.value || "",
            },
            body: JSON.stringify({ id: _carId }),

        })
    }

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch cars: ${response.status}`)
                }

                const contentType = response.headers.get("content-type") || ""
                if (!contentType.includes("application/json")) {
                    throw new Error("Cars endpoint did not return JSON")
                }

                const data = await response.json();
                setCars(data?.cars);

            } catch (error) {
                console.error("Error fetching cars:", error)
            }
        };
        fetchCars();
    }, []);
    const submitCarHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        const name = nameRef.current?.value
        const transmission = transmissionRef.current?.value
        const fuel = fuelRef.current?.value
        const price = priceRef.current?.value
        const className = classNameRef.current?.value
        const category = categoryRef.current?.value
        const location = locationRef.current?.value
        const images = fileRef.current?.files

        if (!name || !transmission || !fuel || !price || !className || !category || !location || !images || images.length === 0) {
            return alert("all fields are required")
        }
        formData.append("name", name)
        formData.append("transmission", transmission)
        formData.append("fuel", fuel)
        formData.append("price", price)
        formData.append("className", className)
        formData.append("category", category)
        formData.append("location", location)
        for (const i of images) {
            formData.append("images", i)
        }

        try {
            const token = await cookieStore.get("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/admin/upload-car`, {
                method: "POST",
                headers: {
                    application: "json",
                },
                body: formData,
            })
            window.location.replace("/")
        } catch (err) {
            console.error(err)
        }
    }


    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const username = usernameRef.current?.value || formData.get("username")
        const password = passwordRef.current?.value || formData.get("password")

        if (!username || !password) {
            return alert("all fields are required")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json()

        if (data.error) {
            return alert(data.error)
        }
        await cookieStore.set({ name: "token", value: data.payload })
        setAdmin(data)
    }
    useEffect(() => {
        const fetchAdmin = async () => {
            const token = await cookieStore.get("token")
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:4000"}/admin/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token.value || "",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => setAdmin(data))
                    .catch((err) => console.error(err))
            }
        }
        fetchAdmin()
    }, [])

    if (!admin) {
        return (

            <form className="flex flex-col items-center justify-center gap-3 h-screen" onSubmit={submitHandler} >
                <input type="text" name="username" placeholder="username" className="input max-w-sm" ref={usernameRef} />
                <input type="password" name="password" placeholder="password" className="input max-w-sm" ref={passwordRef} />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>


        )
    }
    return (
        <>
            <div className="bg-base-200 flex flex-col gap-5 items-center justify-center m-auto my-6 w-full max-w-xl p-6 rounded">
                <h1 className="text-2xl font-semibold">Adaugă mașină</h1>
                <form className="w-full flex flex-col gap-3" onSubmit={submitCarHandler} encType="multipart/form-data">
                    <label className="form-control w-full">
                        <span className="label-text mb-1">Nume</span>
                        <input type="text" name="name" placeholder="Ex: Dacia Duster" className="input w-full" required ref={nameRef} />
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Transmisie</span>
                        <select name="transmission" className="select w-full" defaultValue="" required ref={transmissionRef}>
                            <option value="" disabled>Alege transmisia</option>
                            <option value="manuală">Manuală</option>
                            <option value="automată">Automată</option>
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Combustibil</span>
                        <select name="fuel" className="select w-full" defaultValue="" required ref={fuelRef}>
                            <option value="" disabled>Alege combustibilul</option>
                            <option value="benzină">Benzină</option>
                            <option value="motorină">Motorină</option>
                            <option value="hibrid">Hibrid</option>
                            <option value="electric">Electric</option>
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Preț (EUR)</span>
                        <input type="number" name="price" placeholder="Ex: 250 €" min="0" step="1" className="input w-full" required ref={priceRef} />
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Clasă</span>
                        <input type="text" name="className" placeholder="Ex: SUV" className="input w-full" required ref={classNameRef} />
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Categorie</span>
                        <input type="text" name="category" placeholder="Ex: Premium" className="input w-full" required ref={categoryRef} />
                    </label>

                    <label className="form-control w-full">
                        <span className="label-text mb-1">Locație</span>
                        <select name="location" className="select w-full" defaultValue="Iași" required ref={locationRef}>
                            <option value="iași">Iași</option>
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <span className="label-text mb-1">Imagine mașină</span>
                        <input type="file" name="image" accept="image/*" multiple className="file-input w-full" ref={fileRef} />
                    </label>
                    <button type="button" className="btn btn-outline btn-primary" onClick={() => fileRef.current?.click()}>Upload imagini</button>
                    <button type="submit" className="btn btn-primary mt-2">Adaugă mașina</button>
                </form >
            </div >
            <div className="bg-base-200 flex flex-col gap-5 items-center justify-center m-auto my-6 w-full max-w-xl p-6 rounded">
                <h1 className="text-2xl font-semibold">Mașinile existente</h1>
                <div className="w-full flex flex-col gap-3">
                    {cars?.length ? (
                        cars.map((car) => (
                            <div key={car._id} className="bg-base-100 border border-base-300 rounded-lg p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-20 h-16 rounded overflow-hidden bg-base-200 flex items-center justify-center">
                                        {car.images?.[0] ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/images/${car.images[0]}`}
                                                alt={car.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{car.name}</p>
                                        <p className="text-sm opacity-80">{car.category} • {car.location}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-error btn-sm"
                                    onClick={() => deleteClickHandler(car._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm opacity-70">Nu există mașini disponibile.</p>
                    )}
                </div>

            </div>
        </>
    )
}

export default AdminPage