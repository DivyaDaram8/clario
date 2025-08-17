// import React, { useState } from "react";
// import { Plus } from "lucide-react";
// import { apiRequest } from "../../api";

// function PlusBar({ categories, setTasks }) {
//   const [open, setOpen] = useState(false);

//   const handleCreateTask = async (categoryId) => {
//     try {
//       // Create a new task with default values
//       const newTask = await apiRequest(`/todos/categories/${categoryId}/tasks`, "POST", {
//         name: "New Task",
//         priority: "Medium",
//         description: "",
//       });
//       // Update local state
//       setTasks(prev => [...prev, newTask]);
//       setOpen(false); // close dropdown
//     } catch (err) {
//       console.error("Error creating task:", err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-12 relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
//       >
//         <Plus />
//       </button>

//       {open && (
//         <div className="absolute top-12 left-0 bg-white shadow-lg rounded-md py-2 w-40 z-20">
//           {categories.length > 0 ? (
//             categories.map(cat => (
//               <button
//                 key={cat._id}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                 onClick={() => handleCreateTask(cat._id)}
//               >
//                 {cat.icon} {cat.name}
//               </button>
//             ))
//           ) : (
//             <p className="px-4 py-2 text-gray-500 text-sm">No categories</p>
//           )}
//           {/* Optional: add category button */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PlusBar;


import React from 'react'

function PlusBar() {
  return (
    <div>PlusBar</div>
  )
}

export default PlusBar