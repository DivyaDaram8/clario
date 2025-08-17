import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { apiRequest } from "../../api";

function CategoryColumn({ category, tasks, setTasks }) {
  const [updating, setUpdating] = useState(false);

  const grouped = {
    High: tasks.filter(t => t.priority === "High"),
    Medium: tasks.filter(t => t.priority === "Medium"),
    Low: tasks.filter(t => t.priority === "Low"),
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      setUpdating(true);
      await apiRequest(`/todos/tasks/${taskId}`, "PUT", { completed });
      // Update local state
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed } : t));
    } catch (err) {
      console.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow p-3 w-64 flex-shrink-0">
      <h2 className="font-semibold mb-2">
        {category.icon} {category.name}
      </h2>
      {Object.entries(grouped).map(([prio, list]) => (
        <div key={prio} className="mb-3">
          <h3
            className={`text-xs font-medium mb-1 ${
              prio === "High" ? "text-red-600" :
              prio === "Medium" ? "text-orange-600" : "text-green-600"
            }`}
          >
            {prio} Priority
          </h3>
          {list.length > 0 ? (
            list.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
              />
            ))
          ) : (
            <p className="text-gray-400 text-xs">No tasks</p>
          )}
        </div>
      ))}
      {updating && <p className="text-xs text-gray-500">Updating...</p>}
    </div>
  );
}

export default CategoryColumn;
