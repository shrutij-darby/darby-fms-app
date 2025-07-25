"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { DateTimeRangePicker, DateTimeRange } from "@/components/date-time-range-picker";

export default function Home() {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    from: new Date(),
    to: new Date(),
    startTime: "09:00",
    endTime: "17:00",
  });

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <LoginForm />
      <div className="w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Select Date & Time Range</h2>
        <DateTimeRangePicker
          value={dateTimeRange}
          onChange={setDateTimeRange}
        />
        
      
      </div>
    </div>
  );
}
