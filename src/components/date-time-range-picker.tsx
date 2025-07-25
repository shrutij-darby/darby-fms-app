"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeOption {
  value: string;
  label: string;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      const value = `${h}:${m}`;
      const label = `${hour % 12 || 12}:${m} ${hour < 12 ? "AM" : "PM"}`;
      options.push({ value, label });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export interface DateTimeRange {
  from: Date | undefined;
  to: Date | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
}

interface DateTimeRangePickerProps {
  value: DateTimeRange;
  onChange: (value: DateTimeRange) => void;
  className?: string;
  showTimeRange?: boolean;
}

export function DateTimeRangePicker({
  value,
  onChange,
  className,
  showTimeRange = true,
}: DateTimeRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Format the display value
  const formatDisplayValue = () => {
    if (!value.from) {
      return "Select date and time range";
    }

    const dateFormat = "MMM d, yyyy";
    const fromDate = format(value.from, dateFormat);
    const toDate = value.to ? format(value.to, dateFormat) : fromDate;
    
    const startTime = value.startTime || "00:00";
    const endTime = value.endTime || "23:59";

    if (fromDate === toDate) {
      return `${fromDate} (${startTime} - ${endTime})`;
    }
    
    return `${fromDate} to ${toDate} (${startTime} - ${endTime})`;
  };

  // Handle time selection
  const handleStartTimeChange = (time: string) => {
    onChange({
      ...value,
      startTime: time,
    });
  };

  const handleEndTimeChange = (time: string) => {
    onChange({
      ...value,
      endTime: time,
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-time-range"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value.from}
              selected={{
                from: value.from,
                to: value.to,
              }}
              onSelect={(range) => {
                onChange({
                  ...value,
                  from: range?.from,
                  to: range?.to,
                });
              }}
              numberOfMonths={2}
            />
            {showTimeRange && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Start Time</span>
                </div>
                <Select
                  value={value.startTime || "09:00"}
                  onValueChange={handleStartTimeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>End Time</span>
                </div>
                <Select
                  value={value.endTime || "17:00"}
                  onValueChange={handleEndTimeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                onClick={() => setOpen(false)}
              >
                Apply
              </Button>
              
              <Button 
                size="sm" 
                onClick={() => setOpen(false)}
              >
                  Cancel
              </Button>
              

            </div>
            
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
