// ========== TODO BOARD ==========
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
    <div className="todo-board">
      <CategoryBar
        categories={todos.categories}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id)}
        onOpenAdd={onAddCategory}
        onOpenTaskModal={(id) => {
          setSelectedCategory(id);

          const todayStr = new Date().toISOString().slice(0, 10);
          if (todos.selectedDate < todayStr) {
            alert("You cannot add tasks to past dates 🚫");
            return;
          }

          onAddTask();
        }}
        onDeleteCategory={todos.deleteCategory}
      />

      <div className="todo-board-main">
        <DateBar
          selectedDate={todos.selectedDate}
          onSelect={(d) => todos.setSelectedDate(d)}
        />

        <div className="todo-board-content">
          <KanbanBoard
            categories={todos.categories}
            tasksByCategory={todos.tasksByCategory}
            onToggleDone={async (task) => {
              await todos.updateTask(task._id, { completed: !task.completed });
            }}
            onEdit={(task) => {
              const categoryId = todos.categories.find(cat => 
                todos.tasksByCategory[cat._id]?.some(t => t._id === task._id)
              )?._id;
              setSelectedCategory(categoryId);
              onAddTask(task);
            }}
            onReorder={(catId, newArr) => todos.reorder(catId, newArr)}
            onDelete={(task, categoryId) => todos.deleteTask(task._id, categoryId)}
          />
        </div>
      </div>
    </div>
  );
}