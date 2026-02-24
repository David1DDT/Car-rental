'use client';

import { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';

export default function TimePickerInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const instance = flatpickr(inputRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i'
      });

      return () => {
        if (instance) {
          instance.destroy();
        }
      };
    }
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      className="input input-lg input-bordered w-36"
      placeholder="⏲ HH:MM"
      id="flatpickr-time"
    />
  );
}
