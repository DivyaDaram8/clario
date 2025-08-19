import React, { useState } from "react";
import DateBar from "./DateBar";
import CategoryBar from "./CategoryBar";
import KanbanBoard from "./KanbanBoard";

export default function TodoBoard({ todos, onAddCategory, onAddTask, selectedCategory, setSelectedCategory }) {
  return (
    <div className="w-full">
      {/* Header: Date + Add Task */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <DateBar
          selectedDate={todos.selectedDate}
          onSelect={(d) => todos.setSelectedDate(d)}
        />
        <button
          onClick={onAddTask}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          + Task
        </button>
      </div>

      {/* Responsive layout: sidebar + board */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <CategoryBar
  categories={todos.categories}
  selectedId={selectedCategory}
  onSelect={(id) => setSelectedCategory(id)}
  onOpenAdd={onAddCategory}
  onOpenTaskModal={(id) => {
    setSelectedCategory(id);
    onAddTask(); // trigger AddTaskModal
  }}
/>

        </div>

        {/* Task Board */}
        <div className="flex-1">
          <div className="rounded-2xl bg-white shadow-md p-6 w-full overflow-x-auto">
            <KanbanBoard
              categories={todos.categories}
              tasksByCategory={todos.tasksByCategory}
              onToggleDone={async (task) => {
                await todos.updateTask(task._id, { completed: !task.completed });
              }}
              onEdit={(task) => {
                const name = prompt("Edit title", task.name);
                if (name) todos.updateTask(task._id, { name });
              }}
              onReorder={(catId, newArr) => todos.reorder(catId, newArr)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
