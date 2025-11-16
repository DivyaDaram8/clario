// ========== DATE BAR ==========
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
    <div className="date-bar">
      <div className="date-buttons">
        {buttons.map(({ label, offset }) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          const dateStr = shortDate(offset);

          return (
            <button
              key={label}
              onClick={() => onSelect(dateStr)}
              className={`date-btn ${selectedDate === dateStr ? "date-btn-active" : ""}`}
            >
              <span className="date-label">{label}</span>
              <span className="date-number">{d.getDate()}</span>
            </button>
          );
        })}

        <div className="date-picker-wrapper" ref={calendarRef}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="date-picker-btn"
          >
            📅 Pick Date
          </button>

          {showCalendar && (
            <div className="date-picker-dropdown">
              <DatePicker
                inline
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                onChange={(date) => {
                  if (date) {
                    const pickedStr = date.toISOString().slice(0, 10);
                    onSelect(pickedStr);
                    setShowCalendar(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}