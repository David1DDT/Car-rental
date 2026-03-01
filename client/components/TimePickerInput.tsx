'use client';

import { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';

interface TimePickerInputProps {
  className?: string;
  required?: boolean;
  onChange?: (time: string) => void;
  value?: string;
}

export default function TimePickerInput({ className, required, onChange, value }: TimePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const instance = flatpickr(inputRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        onChange: (_, dateStr) => {
          if (onChange) {
            onChange(dateStr);
          }
        }
      });

      return () => {
        if (instance) {
          instance.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || "";
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      className={className || "input input-md input-bordered w-full"}
      placeholder="⏲ HH:MM"
      id="flatpickr-time"
      required={required}
    />
  );
}
