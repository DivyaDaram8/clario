import React from "react";

function shortDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0,10);
}

export default function DateBar({ selectedDate, onSelect }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl">
      {[ -1, 0, 1 ].map(off => {
        const d = new Date();
        d.setDate(d.getDate() + off);
        const label = off === 0 ? "Today" : (off === -1 ? "Yesterday" : "Tomorrow");
        const dateStr = shortDate(off);
        return (
          <button
            key={off}
            onClick={() => onSelect(dateStr)}
            className={`px-3 py-1 rounded-lg ${selectedDate === dateStr ? "bg-indigo-600 text-white" : "text-gray-200 hover:bg-white/5"}`}
          >{label} · {d.getDate()}</button>
        );
      })}

      <button
        className="ml-3 px-3 py-1 rounded-lg text-gray-200 hover:bg-white/5"
        onClick={() => {
          const pick = prompt("Enter date YYYY-MM-DD"); // minimal; replace with a datepicker component if desired
          if (pick) onSelect(pick);
        }}
      >📅 Pick</button>
    </div>
  );
}
