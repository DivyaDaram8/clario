import React, { useState } from "react";
import useTodos from "../hooks/useTodos";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import AddCategoryModal from "../components/todo/AddCategoryModal";
import AddTaskModal from "../components/todo/AddTaskModal";
import TodoBoard from "../components/todo/TodoBoard";

export default function Todo() {
  const todos = useTodos();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  return (
    <>
      <NavbarLeft />
      <NavbarTop />

      <div className="min-h-screen bg-gray-100 text-gray-900 pl-20 pt-20 p-6">
        <TodoBoard
          todos={todos}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAddCategory={() => setCatModalOpen(true)}
          onAddTask={() => setTaskModalOpen(true)}
        />

        {/* Modals */}
        <AddCategoryModal
          open={catModalOpen}
          onClose={() => setCatModalOpen(false)}
          onCreate={async (payload) => {
            await todos.createCategory(payload);
            setCatModalOpen(false);
          }}
        />

        <AddTaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onCreate={async (payload) => {
            const targetCat =
              selectedCategory || (todos.categories[0] && todos.categories[0]._id);
            if (!targetCat) return alert("Create a category first");
            await todos.createTask(targetCat, payload);
            setTaskModalOpen(false);
          }}
          categoryId={selectedCategory}
        />
      </div>
    </>
  );
}
