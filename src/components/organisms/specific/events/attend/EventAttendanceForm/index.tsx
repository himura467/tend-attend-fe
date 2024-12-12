"use client";

import React from "react";
import { AttendanceStatus, AttendanceStatusRecord } from "@/lib/types/event/attendance";

interface EventAttendanceFormProps {
  eventSummary: string;
  onSubmit: (status: AttendanceStatus) => void;
  onClose: () => void;
}

export const EventAttendanceForm = ({
  eventSummary,
  onSubmit,
  onClose,
}: EventAttendanceFormProps): React.JSX.Element => {
  const [status, setStatus] = React.useState<AttendanceStatus>(AttendanceStatus.PRESENT);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(status);
  };

  return (
    <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Attendance for: {eventSummary}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block">Attendance Status:</label>
            <select
              className="rounded w-full border p-2"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value) as AttendanceStatus)}
            >
              {Object.entries(AttendanceStatusRecord).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-200 rounded hover:bg-gray-300 px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
