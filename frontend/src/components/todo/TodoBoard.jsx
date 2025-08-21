import React from "react";
import DateBar from "./DateBar";
import CategoryBar from "./CategoryBar";
import KanbanBoard from "./KanbanBoard";

export default function TodoBoard({
  todos,
  onAddCategory,
  onAddTask,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex w-full h-[calc(100vh-80px)] gap-6">
      {/* Category Sidebar */}
      <div className="w-64 flex-shrink-0">
        {/* added deleteCategory support */}
<CategoryBar
  categories={todos.categories}
  selectedId={selectedCategory}
  onSelect={(id) => setSelectedCategory(id)}
  onOpenAdd={onAddCategory}
  onOpenTaskModal={(id) => {
    setSelectedCategory(id);
    onAddTask(); // opens modal
  }}
  onDeleteCategory={todos.deleteCategory}
/>

      </div>

      {/* Right side */}
      <div className="flex flex-col flex-1 gap-4">
        <div>
          <DateBar
            selectedDate={todos.selectedDate}
            onSelect={(d) => todos.setSelectedDate(d)}
          />
        </div>

        <div className="flex-1 rounded-2xl bg-white shadow-md p-6 overflow-x-auto">
          <KanbanBoard
            categories={todos.categories}
            tasksByCategory={todos.tasksByCategory}
            onToggleDone={async (task) => {
              await todos.updateTask(task._id, { completed: !task.completed });
            }}
            onEdit={(task) => {
              // Find the category ID for this task
              const categoryId = todos.categories.find(cat => 
                todos.tasksByCategory[cat._id]?.some(t => t._id === task._id)
              )?._id;
              setSelectedCategory(categoryId);
              onAddTask(task); // pass task into modal
            }}
            onReorder={(catId, newArr) => todos.reorder(catId, newArr)}
            onDelete={(task, categoryId) => todos.deleteTask(task._id, categoryId)}
          />
        </div>
      </div>
    </div>
  );
}