'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CancelPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                {/* Cancel Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Plată anulată</h1>
                <p className="text-gray-600 mb-6">
                    Plata a fost anulată. Nicio taxă nu a fost debitată din contul dumneavoastră.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        Dacă aveți probleme, vă rugăm să <span className="font-semibold">încercați din nou</span> sau contactați asistența.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Înapoi la checkout
                    </button>
                    <Link href="/">
                        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors">
                            Înapoi la acasă
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
