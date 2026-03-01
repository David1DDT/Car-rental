import CarCards from "@/components/CarCards";
import { Suspense } from "react";


const CarsPage = async ({ searchParams }: { searchParams: Promise<{ startDate: string, endDate: string, location: string }> }) => {
    const { startDate, endDate, location } = await searchParams;

    return (

        <CarCards startDate={startDate} endDate={endDate} location={location} />
    )
}

export default CarsPage

const Loading = () => {
    return (
        <div>Loading...</div>
    )
}