"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePickerInput from "@/components/DatePickerInput";
import TimePickerInput from "@/components/TimePickerInput";

export default function Home() {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [sameLocation, setSameLocation] = useState(true);

  const formatDateTimeParam = (date: Date | null, time: string) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const safeTime = /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
    return `${year}-${month}-${day}T${safeTime}`;
  };

  // Seteaza data minima la maine
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      e.currentTarget.reportValidity();
      return;
    }
    router.push(
      `/cars?startDate=${formatDateTimeParam(pickupDate, pickupTime)}&endDate=${formatDateTimeParam(returnDate, returnTime)}&location=${sameLocation ? "iasi" : ""}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1d1d1f]">

      <section className="relative">
        <div className="relative h-[350px] overflow-hidden sm:h-[420px]">


          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,21,34,0.66),rgba(17,20,24,0.52),rgba(48,20,4,0.62))]" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-center px-4 text-center sm:px-6">
            <p className="text-3xl font-semibold text-[#f4b942] sm:text-4xl">Top oferte Rent a Car</p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Rezerva masina chiar azi!
            </h1>
          </div>


          <div className="carousel-pagination absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2" />
        </div>

        <div className="relative z-20 mx-auto -mt-14 w-full max-w-[1060px] px-4 sm:px-6">
          <form
            className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_14px_36px_rgba(0,0,0,0.14)]"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/60">
                  Locatie preluare
                </label>
                <select required className="select select-bordered h-11 w-full rounded-md border-black/20 bg-white text-sm">
                  <option value="">Locatie preluare *</option>
                  <option value="iasi">Iasi</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/60">
                  Data preluare
                </label>
                <div className="grid grid-cols-[1fr_108px] gap-2">
                  <DatePickerInput
                    placeholder="Data preluare"
                    minDate={tomorrow}
                    maxDate={returnDate || undefined}
                    onChange={setPickupDate}
                    value={pickupDate}
                    required
                    className="input input-bordered h-11 w-full rounded-md border-black/20 bg-white text-sm"
                  />
                  <TimePickerInput
                    required
                    value={pickupTime}
                    onChange={setPickupTime}
                    className="input input-bordered h-11 w-full rounded-md border-black/20 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/60">
                  Data predare
                </label>
                <div className="grid grid-cols-[1fr_108px] gap-2">
                  <DatePickerInput
                    placeholder="Data predare"
                    minDate={pickupDate || tomorrow}
                    onChange={setReturnDate}
                    value={returnDate}
                    required
                    className="input input-bordered h-11 w-full rounded-md border-black/20 bg-white text-sm"
                  />
                  <TimePickerInput
                    required
                    value={returnTime}
                    onChange={setReturnTime}
                    className="input input-bordered h-11 w-full rounded-md border-black/20 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="btn h-11 border-none bg-[#181a20] px-8 text-sm tracking-wide text-white hover:bg-black"
                >
                  CAUTA
                </button>
              </div>

            </div>

            <label className="mt-4 inline-flex items-center gap-2 text-sm text-black/70">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={sameLocation}
                onChange={(e) => setSameLocation(e.target.checked)}
              />
              Returneaza in aceeasi locatie
            </label>
          </form>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1180px] px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <article className="flex gap-4 rounded-lg bg-transparent p-2">
            <div className="grid h-12 w-12 place-items-center">
              <svg width="40px" height="40px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--noto" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.66 87.9c-3.9 3.54-5.55 12.5-5.99 18.12c2.69 4.84 31.63 10.49 60.57 10.49c29.03 0 57.58-5.62 60.09-10.47c-.39-5.64-2.56-14.58-5.97-18.12c-3.95-4.11-104.26-4.05-108.7-.02z" fill="#0"> </path> <ellipse cx="64" cy="90.07" rx="55.47" ry="10.49" fill="#0"> </ellipse> <ellipse cx="64" cy="87.16" rx="50.6" ry="8.05" fill="#ffffff"> </ellipse> <g fill="#0"> <path d="M105.24 72.89c-8.69-3.47-26.54-4.88-40.75-4.88h-.98c-14.21 0-31.68 2.62-40.75 4.88c-4.23 1.06-9.52 4.23-9.52 7.72c0 5.79 22.21 10.26 50.76 10.26s50.76-4.47 50.76-10.26c0-3.49-4.23-5.6-9.52-7.72z"> </path> <path d="M64 31.67c-46.34 0-45.72 45.73-45.72 45.73C28.64 80.18 44.9 83.47 64 83.47s35.36-3.29 45.72-6.06c0-.01.62-45.74-45.72-45.74z"> </path> </g> <path d="M68.33 18.35h-8.65v14.72s.9 1.26 4.33 1.26c3.42 0 4.33-1.26 4.33-1.26V18.35z" fill="#0"> </path> <path d="M76.95 18.81c-2.15-.89-13.63-.89-13.67-.89c-3.51 0-9.99.31-12.24.89l.34 4.91c1.01 1.49 5.49 2.62 12.55 2.62s11.43-1.08 12.55-2.62l.47-4.91z" fill="#0"> </path> <path d="M64.12 11.49c-9.86 0-13.08 6.42-13.08 7.31c0 1.48 5.67 2.62 12.95 2.62s12.95-1.14 12.95-2.62c.01-.88-2.95-7.31-12.82-7.31z" fill="#0"> </path> <path d="M64.37 82.25c-35.23 0-45.9-7.7-45.9-7.7l.42-4.14c.92.41 11.88 7.84 45.48 7.84c33.52 0 44.65-7.71 44.75-7.79l.42 4.36s-9.9 7.43-45.17 7.43z" fill="#0"> </path> <path d="M55.56 17.91c-.61-.51-.32-1.21.09-1.9c1.19-1.99 3.03-3.03 5.2-2.97c2.69.09 2.83 1.71 1.95 2.72c-.94 1.09-3.67 1.18-5.55 2.25c-.55.32-1.21.3-1.69-.1z" fill="#ffffff"> </path> <path d="M35.33 56.1l-1.88-2.38c-.64-.82-.79-1.92-.37-2.87c2.64-5.95 8.23-10.43 15.17-12.27c1.22-.33 2.49.39 2.87 1.59l1.47 4.54c.47 1.47-.4 2.99-1.89 3.4c-4.68 1.29-9.9 4.53-12.66 8.03c-.69.87-2.03.84-2.71-.04z" fill="#ffffff"> </path> </g></svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Servicii</h3>
              <p className="mt-1 text-[26px] leading-relaxed text-black/80">
                Asistenta rutiera 24/7 pentru linistea ta.
              </p>
            </div>
          </article>

          <article className="flex gap-4 rounded-lg bg-transparent p-2">
            <div className="grid h-12 w-12 place-items-center">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 4l18 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 6.4c.64-.2 1.3-.3 2-.3 4.1 0 7.5 2.5 8.8 5.9a8.8 8.8 0 0 1-2.5 3.8M7 8a9.2 9.2 0 0 0-3.8 4c1.3 3.4 4.7 5.9 8.8 5.9 1.6 0 3.1-.4 4.4-1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Fara costuri ascunse</h3>
              <p className="mt-1 text-[26px] leading-relaxed text-black/80">Ce vezi este ceea ce platesti.</p>
            </div>
          </article>

          <article className="flex gap-4 rounded-lg bg-transparent p-2">
            <div className="grid h-12 w-12 place-items-center ">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 11h16M7 11l1.2-3.3A2 2 0 0 1 10.1 6h3.8a2 2 0 0 1 1.9 1.7L17 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 11v5a1 1 0 0 0 1 1h1v1.5M19 11v5a1 1 0 0 1-1 1h-1v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Flota diversa</h3>
              <p className="mt-1 text-[26px] leading-relaxed text-black/80">
                Alege dintr-o selectie larga de vehicule premium si fiabile.
              </p>
            </div>
          </article>

          <article className="flex gap-4 rounded-lg bg-transparent p-2">
            <div className="grid h-12 w-12 place-items-center ">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 12l4-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 4v1.5M20 12h-1.5M12 20v-1.5M4 12h1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Kilometri nelimitati</h3>
              <p className="mt-1 text-[26px] leading-relaxed text-black/80">
                Exploreaza orasele si nu numai, fara limite. *se aplica unde este mentionat
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-4 pb-14 sm:px-6">
        <h2 className="text-4xl font-bold tracking-tight">Rent a Car personalizat nevoilor tale</h2>
        <p className="mt-3 text-[23px] leading-relaxed text-black/85">
          Cu serviciile car rentals de la Autodomi gasesti masina de inchiriat potrivita pentru nevoile tale de
          mobilitate. Ai kilometri nelimitati pentru deplasarile nationale si posiblitatea de a prelua si preda
          autoturismul in locatii diferite.
        </p>

        <h2 className="mt-8 text-4xl font-bold tracking-tight">Inchiriere auto fara costuri ascunse</h2>
        <p className="mt-3 text-[23px] leading-relaxed text-black/85">
          Calculeaza online pretul inchirierii sau aboneaza-te la newsletter si primesti periodic cele mai bune oferte
          Autodomi rent a car.
        </p>
        <p className="mt-2 text-[23px] leading-relaxed text-black/85">
          Atentie! Nu putem garanta rezervarea exacta a unui model de autoturism dintr-o clasa deoarece evenimente
          neprevazute pot aparea pana la data preluarii acestuia.
        </p>
        <p className="mt-4 text-[23px] leading-relaxed text-black/85">
          Pentru serviciile de inchiriere auto, apeleaza la Autodomi, partenerul tau de mobilitate oriunde in tara.
          Rezervari non-stop, online sau la numarul de telefon afisat.
        </p>
      </section>
    </main>
  );
}
