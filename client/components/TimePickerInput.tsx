'use client';

import { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';

interface TimePickerInputProps {
  className?: string;
}

export default function TimePickerInput({ className }: TimePickerInputProps) {
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
      className={className || "input input-md input-bordered w-full"}
      placeholder="⏲ HH:MM"
      id="flatpickr-time"
    />
  );
}
