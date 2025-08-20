import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateBar({ selectedDate, onSelect }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const shortDate = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const buttons = [
    { label: "Yesterday", offset: -1 },
    { label: "Today", offset: 0 },
    { label: "Tomorrow", offset: 1 },
  ];

  // Close calendar when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-2xl justify-center">
        {buttons.map(({ label, offset }) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          const dateStr = shortDate(offset);

          return (
            <button
              key={label}
              onClick={() => onSelect(dateStr)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  selectedDate === dateStr
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
            >
              {label} · {d.getDate()}
            </button>
          );
        })}

        {/* Calendar Picker */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            📅 Pick Date
          </button>

          {showCalendar && (
            <div
              className="absolute top-14 left-1/2 -translate-x-1/2 
                w-[340px] bg-white border border-gray-200
                rounded-2xl shadow-2xl z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
            >
              <DatePicker
                inline
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                onChange={(date) => {
                  if (date) {
                    onSelect(date.toISOString().slice(0, 10));
                    setShowCalendar(false);
                  }
                }}
                calendarClassName="custom-calendar"
                dayClassName={(d) =>
                  `custom-day ${
                    selectedDate &&
                    new Date(selectedDate).toDateString() === d.toDateString()
                      ? "custom-day-selected"
                      : ""
                  }`
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Custom Calendar CSS */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .custom-calendar {
            border: none !important;
            background: transparent;
            font-family: 'Inter', sans-serif;
          }
          .custom-calendar .react-datepicker__header {
            background: transparent;
            border-bottom: none;
            padding: 6px 0;
          }
          .custom-calendar .react-datepicker__current-month {
            font-size: 0.95rem;
            font-weight: 600;
            color: #1f2937;
          }
          .custom-day {
            border-radius: 6px;
            padding: 0.45rem;
            transition: background 0.2s, color 0.2s;
          }
          .custom-day:hover {
            background: #eef2ff;
            color: #4338ca;
          }
          .custom-day-selected {
            background: #4f46e5 !important;
            color: white !important;
            font-weight: 600;
          }
          .react-datepicker__day--today {
            border: 1px solid #4f46e5;
            border-radius: 6px;
          }
        `}
      </style>
    </div>
  );
}
