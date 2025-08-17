// import React from "react";
// import { Calendar } from "lucide-react";

// function DateBar() {
//   const today = new Date();
//   const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
//   const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

//   const dates = [yesterday, today, tomorrow];

//   return (
//     <div className="flex items-center gap-4 border-b pb-2">
//       {dates.map((d, i) => (
//         <button
//           key={i}
//           className={`px-3 py-1 rounded-md ${
//             d.toDateString() === today.toDateString()
//               ? "bg-blue-500 text-white"
//               : "text-gray-700 hover:bg-gray-100"
//           }`}
//         >
//           {d.getDate()}
//         </button>
//       ))}
//       <button className="ml-auto p-2 hover:bg-gray-100 rounded-md">
//         <Calendar className="h-5 w-5 text-gray-700" />
//       </button>
//     </div>
//   );
// }

// export default DateBar;


import React from 'react'

function DateBar() {
  return (
    <div>DateBar</div>
  )
}

export default DateBar