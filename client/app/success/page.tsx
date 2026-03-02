'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
    const router = useRouter()

    useEffect(() => {
        // Optional: redirect to home after 5 seconds
        const timer = setTimeout(() => {
            router.push('/')
        }, 5000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Plată efectuată!</h1>
                <p className="text-gray-600 mb-6">
                    Mulțumim pentru rezervare. Plata dumneavoastră a fost procesată cu succes.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Stare comandă:</span> Confirmată
                    </p>
                    <p className="text-sm text-gray-600">
                        Veți primi un email cu detaliile rezervării în curând.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link href="/">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Înapoi la acasă
                        </button>
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Redirecționare automată în 5 secunde...
                </p>
            </div>
        </div>
    )
}
