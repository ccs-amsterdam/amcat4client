"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  label: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
}

export default function DatePicker({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold">{label}</h3>
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        captionLayout="dropdown-buttons"
        fromYear={1960}
        toYear={2030}
        initialFocus
      />
    </div>
  );
}
