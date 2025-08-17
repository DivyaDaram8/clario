// import React, { useState } from "react";
// import { apiRequest } from "../../api";

// function TaskCard({ task, setTasks }) {
//   const [editing, setEditing] = useState(false);
//   const [name, setName] = useState(task.name);
//   const [priority, setPriority] = useState(task.priority);
//   const [description, setDescription] = useState(task.description || "");

//   const handleSave = async () => {
//     try {
//       const updated = await apiRequest(`/todos/tasks/${task._id}`, "PUT", {
//         name,
//         priority,
//         description
//       });
//       setTasks(prev =>
//         prev.map(t => (t._id === task._id ? updated : t))
//       );
//       setEditing(false);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-md px-3 py-2 mb-2 text-sm flex flex-col">
//       {editing ? (
//         <>
//           <input
//             className="border p-1 mb-1 text-sm rounded"
//             value={name}
//             onChange={e => setName(e.target.value)}
//           />
//           <select
//             className="border p-1 mb-1 text-sm rounded"
//             value={priority}
//             onChange={e => setPriority(e.target.value)}
//           >
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </select>
//           <textarea
//             className="border p-1 mb-1 text-sm rounded"
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//             placeholder="Description..."
//           />
//           <div className="flex justify-end gap-2">
//             <button
//               className="px-2 py-1 bg-green-500 text-white rounded"
//               onClick={handleSave}
//             >
//               Save
//             </button>
//             <button
//               className="px-2 py-1 bg-gray-300 rounded"
//               onClick={() => setEditing(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="flex justify-between items-center">
//           <span className={`${task.completed ? "line-through text-gray-400" : ""}`}>
//             {task.name}
//           </span>
//           <div className="flex gap-2 items-center">
//             <span
//               className={`px-1 rounded text-xs ${
//                 priority === "High" ? "text-red-600" :
//                 priority === "Medium" ? "text-orange-600" : "text-green-600"
//               }`}
//             >
//               {priority}
//             </span>
//             <input
//               type="checkbox"
//               checked={task.completed}
//               onChange={async () => {
//                 const updated = await apiRequest(`/todos/tasks/${task._id}`, "PUT", {
//                   completed: !task.completed
//                 });
//                 setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
//               }}
//             />
//             <button
//               className="text-blue-500 text-xs"
//               onClick={() => setEditing(true)}
//             >
//               Edit
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TaskCard;

import React from 'react'

function TaskCard() {
  return (
    <div>TaskCard</div>
  )
}

export default TaskCard
