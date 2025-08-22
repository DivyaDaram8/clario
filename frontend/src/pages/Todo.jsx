import React, { useState } from "react";
import useTodos from "../hooks/useTodos";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import AddCategoryModal from "../components/todo/AddCategoryModal";
import AddTaskModal from "../components/todo/AddTaskModal";
import TodoBoard from "../components/todo/TodoBoard";
import '../index.css'; // Ensure global styles are applied


export default function Todo() {
  const todos = useTodos();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  return (
    <>
      {/* Fixed layout wrapper */}
      <div className="todo-page">
        {/* <NavbarTop /> */}
        <div className="todo-container">
          <NavbarLeft />
          <div className="todo-content">
            <TodoBoard
  todos={todos}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}   // ✅ correct now
  onAddCategory={() => setCatModalOpen(true)}
  onAddTask={(task) => {
    setEditingTask(task || null);
    setTaskModalOpen(true);
  }}
/>

          </div>
        </div>
      </div>

      {/* Category Modal */}
      <AddCategoryModal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        onCreate={async (payload) => {
          await todos.createCategory(payload);
          setCatModalOpen(false);
        }}
      />

      {/* Task Modal */}
<AddTaskModal
  open={taskModalOpen}
  task={editingTask}
  categoryId={selectedCategory}
  categories={todos.categories}
  onClose={() => {
    setTaskModalOpen(false);
    setEditingTask(null);
    setSelectedCategory(null);
  }}
onCreate={async (payload) => {
  const targetCat = selectedCategory || todos.categories[0]?._id;
  if (!targetCat) return alert("Create a category first");

const todayStr = new Date().toISOString().slice(0, 10);
if (todos.selectedDate < todayStr) {
  alert("You cannot create tasks for past dates 🚫");
  return;
}


  await todos.createTask(targetCat, {
    ...payload,
    taskDate: new Date(todos.selectedDate),  // ✅ use selectedDate
  });

  setTaskModalOpen(false);
  setEditingTask(null);
  setSelectedCategory(null);
}}

/>


    </>
  );
}
