"use client"

import CarCards from "@/components/CarCards";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CarsContent = () => {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const location = searchParams.get("location") || "";

    return <CarCards startDate={startDate} endDate={endDate} location={location} />;
};

const CarsPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CarsContent />
        </Suspense>
    );
};

export default CarsPage