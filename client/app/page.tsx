"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import DatePickerInput from "@/components/DatePickerInput";
import TimePickerInput from "@/components/TimePickerInput";

export default function Home() {
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <>
    <div className="mx-2 sm:mx-4 md:mx-[10%] lg:mx-[15%] mt-1.5">
    <div data-carousel='{ "loadingClasses": "opacity-0", "dotsItemClasses": "carousel-box carousel-active:bg-primary" }' className="relative w-full">
      <div className="carousel h-48 sm:h-64 md:h-80">
        <div className="carousel-body h-full opacity-0">
          <div className="carousel-slide">
            <div className="flex h-full justify-center">
              <img src="https://www.autonom.ro/weekend/img/autonom-weekend-2025_04-2_B_770x257-RO.jpg" alt="" className="size-full object-cover" />
            </div>
          </div>
          <div className="carousel-slide active">
            <div className="flex h-full justify-center">
              <img src="https://www.autonom.ro/garantie0/img/autonom-garantie_0_iarna-declinari_770x257.jpg" alt="" className="size-full object-cover" />
            </div>
          </div>
          <div className="carousel-slide">
            <div className="flex h-full justify-center">
              <img src="https://www.autonom.ro/electric/img/autonom-electrice-2025_04-set_2_C_770x257-RO.jpg" alt="" className="size-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="carousel-prev start-5 max-sm:start-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm">
        <span className="icon-[tabler--chevron-left] size-5 text-xs font-bold">&#8592;</span>
        <span className="sr-only">Previous</span>
      </button>
      <button type="button" className="carousel-next end-5 max-sm:end-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm">
        <span className="icon-[tabler--chevron-right] size-5 text-xs font-bold">&#8594;</span>
        <span className="sr-only">Next</span>
      </button>

      <div className="carousel-pagination absolute bottom-3 end-0 start-0 flex justify-center gap-3"></div>
    </div>

      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-5 mt-4 sm:mt-5 text-purple-900">Rent a Car<br /> Inchiriaza o Masina Simplu si Rapid </h1>
      <h2 className="text-sm sm:text-base md:text-xl font-bold mb-3 sm:mb-5 text-purple-700">✓ Masini noi ✓ Livrare gratuita pe raza orasului ✓ Rezervari si asistenta rutiera 24/7 </h2>
      <form className="mb-5">
        {/* Location Section - Above */}
        <div className="mb-4 sm:mb-6">
          <p className="text-base sm:text-lg font-semibold mb-2">Alege locație preluare:</p>
          <select 
            data-select='{
            "placeholder": "Alege locație...",
            "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
            "toggleClasses": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40 max-w-sm",
            "dropdownClasses": "advance-select-menu border border-base-content/20 rounded-lg shadow-lg max-w-sm",
            "optionClasses": "advance-select-option selected:select-active",
            "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span>✓</span></div>",
            "extraMarkup": "<span class=\"shrink-0 text-base-content absolute top-1/2 end-3 -translate-y-1/2 pointer-events-none\"></span>"
            }'
            className="select select-bordered select-sm bg-base-100 text-base-content w-full">
            <option value="">Choose location...</option>
            <option value="iasi">Iasi</option>
          </select>
        </div>

        {/* Date and Time in single line - Full width */}
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 w-full">
          {/* Preluare Section */}
          <div className="flex flex-col flex-1">
            <label className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Preluare</label>
            <div className="flex gap-2 md:gap-3">
              <DatePickerInput  
                placeholder="📅 Alege data preluare" 
                minDate={tomorrow}
                maxDate={returnDate || undefined}
                onChange={setPickupDate}
                value={pickupDate}
              />
              <TimePickerInput />
            </div>
          </div>

          {/* Predare Section */}
          <div className="flex flex-col flex-1">
            <label className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Predare</label>
            <div className="flex gap-2 md:gap-3">
              <DatePickerInput  
                placeholder="📅 Alege data predare" 
                minDate={pickupDate || tomorrow}
                onChange={setReturnDate}
                value={returnDate}
              />
              <TimePickerInput />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-sm md:btn-md btn-primary w-full md:w-auto"
            onClick={(e) => e.preventDefault()}
          >
            Alege mașina
          </button>
        </div>
      </form>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 text-purple-900">Servicii disponibile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5">

      <div className="border-base-content/20 rounded-lg bg-base-100 p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-base-content">🚗 Masini noi si bine intretinute</h3>
        <p className="text-sm sm:text-base">Oferta nossa cuprinde o varietate larga de vehicule noi si recent revizie. Toate masinile noastre sunt inspectate si intretinute la cel mai inalt standard de siguranta si confort pentru a asigura o calatorie placuta.</p>
        </div>
      <div className="border-base-content/20 rounded-lg bg-base-100 p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-base-content">🛡️ Asigurare completa si asistenta 24/7</h3>
        <p className="text-sm sm:text-base">Vei beneficia de o asigurare RCA si CASCO cuprinzatoare cu responsabilitate civila inclusa. Echipa noastra de specialisti este disponibila 24/7 pentru a ti oferi suport rutier in caz de urgenta, oriunde te-ai afla in tara.</p>
        </div>
      <div className="border-base-content/20 rounded-lg bg-base-100 p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-base-content">🎁 Preturi competitive si promotiunu attractive</h3>
        <p className="text-sm sm:text-base">Oferim preturi transparente fara costuri ascunse si reduceri speciale pentru inchirieri pe termen lung. Aboneaza-te la newsletter-ul nostru pentru a primi oferte exclusive si coduri promotioane care te vor ajuta sa economisesti.</p>
        </div>
      </div>

      <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 text-purple-900">Rent a Car personalizat nevoilor tale</h2>
      <p className="text-sm sm:text-base mb-3 sm:mb-4">Cu serviciile car rentals de la Autodomi gasesti masina de inchiriat potrivita pentru nevoile tale de mobilitate. Ai kilometri nelimitati pentru deplasarile nationale si posiblitatea de a prelua si preda autoturismul in locatii diferite.</p>

      <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 text-purple-900">Inchiriere auto fara costuri ascunse</h2>
      <p className="text-sm sm:text-base mb-3 sm:mb-4">Calculeaza online pretul inchirierii sau aboneaza-te la newsletter si primesti periodic cele mai bune oferte Autodomi rent a car.</p>
      <p className="text-sm sm:text-base mb-3 sm:mb-4">Atentie! Nu putem garanta rezervarea exacta a unui model de autoturism dintr-o clasa deoarece evenimente neprevazute pot aparea pana la data preluarii acestuia.</p>

      <p className="text-sm sm:text-base mb-4">Pentru serviciile de inchiriere auto, apeleaza la Autodomi, partenerul tau de mobilitate oriunde in tara. Rezervari non-stop, online sau la numarul de telefon afisat.</p>
    </div>

    </>
  )
}
