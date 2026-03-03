'use client';

import { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';

interface DatePickerInputProps {
  placeholder: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
  value?: Date | null;
  className?: string;
  required?: boolean;
}

export default function DatePickerInput({ placeholder, minDate, maxDate, onChange, value, className, required }: DatePickerInputProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  const instanceRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (inputRef.current && !instanceRef.current) {
      instanceRef.current = flatpickr(inputRef.current, {
        monthSelectorType: 'static',
        mode: 'single',
        disableMobile: true,
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates) => {
          if (onChange) {
            onChange(selectedDates.length > 0 ? selectedDates[0] : null);
          }
        }
      });

      return () => {
        if (instanceRef.current) {
          instanceRef.current.destroy();
          instanceRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.set('minDate', minDate);
      instanceRef.current.set('maxDate', maxDate);
    }
  }, [minDate, maxDate]);

  useEffect(() => {
    if (instanceRef.current && value) {
      instanceRef.current.setDate(value);
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      className={className || "input input-md input-bordered w-full"}
      placeholder={placeholder}
      required={required}
    />
  );
}
