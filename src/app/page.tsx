"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { LoginForm } from "@/components/login-form";
import { DateTimeRangePicker, DateTimeRange } from "@/components/date-time-range-picker";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { SelectDemo } from "@/components/select-demo";
import {  SelectDropdown } from "@/components/ui/select";
import { DialogExample } from "@/components/examples/dialog-example";
import { FileUpload } from "@/components/file-upload";
import { ImageUpload } from "@/components/image-upload";

// Example data type for the table
interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

// Sample data for the table
const appointmentData: Appointment[] = [
  {
    id: "1",
    name: "Meeting with Client A",
    date: "2025-07-28",
    time: "10:00",
    status: "scheduled",
    notes: "Discuss project requirements"
  },
  {
    id: "2",
    name: "Team Standup",
    date: "2025-07-28",
    time: "09:00",
    status: "completed",
    notes: "Daily progress update"
  },
  {
    id: "3",
    name: "Project Review",
    date: "2025-07-29",
    time: "14:00",
    status: "scheduled",
    notes: "End of sprint review"
  },
  {
    id: "4",
    name: "Client B Consultation",
    date: "2025-07-30",
    time: "11:30",
    status: "scheduled",
    notes: "Initial consultation"
  },
  {
    id: "5",
    name: "Team Training",
    date: "2025-07-31",
    time: "13:00",
    status: "cancelled",
    notes: "New tool introduction"
  }
];

export default function Home() {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    from: new Date(),
    to: new Date(),
    startTime: "09:00",
    endTime: "17:00",
  });
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("");
  
  // Sample options for the EnhancedSelect component
  const sampleOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5" },
  ];

  // Define columns for the data table
  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-medium"
        >
          Appointment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                status === "scheduled" ? "bg-blue-500" : 
                status === "completed" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
  ];

  // Handle row click
  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    console.log("Selected appointment:", appointment);
  };

  return (
    <div className="font-sans flex flex-col items-center p-8 gap-8">
      <LoginForm />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          <h2 className="text-lg font-medium mb-4">Select Date & Time Range</h2>
          <DateTimeRangePicker
            value={dateTimeRange}
            onChange={setDateTimeRange}
          />
        </div>
        
        <div className="w-full">
          <h2 className="text-lg font-medium mb-4">Appointments</h2>
          {selectedAppointment && (
            <div className="mb-4 p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium">Selected: {selectedAppointment.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedAppointment.date} at {selectedAppointment.time}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-4xl">
        <DataTable
          data={appointmentData}
          columns={columns}
          onRowClick={handleRowClick}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 15, 20]}
          searchPlaceholder="Search appointments..."
        />
      </div>
      <SelectDemo />
      <SelectDropdown 
        options={sampleOptions} 
        filter={true}
        value={selectedValue} 
        onValueChange={setSelectedValue} 
        placeholder="Select an option..."
        className="w-full max-w-sm"
        label="Select Example"
        allowClear={true}
      />
      <DialogExample />
      <div className="flex gap-2">
          <Button variant={'destructive'}>Button - Destructive</Button>
          <Button variant={'outline'}>Button - Outline</Button>
          <Button variant={'secondary'}>Button - Secondary</Button>
          <Button variant={'ghost'}>Button - Ghost</Button>
          <Button variant={'link'}>Button - Link</Button>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">File Upload Component</h2>
          <FileUpload />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Image Upload Component</h2>
          <ImageUpload />
        </div>
      </div>
     <Alert title="Alert" description="This is an alert" variant={'default'} />
    </div>
  );
}
