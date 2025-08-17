import React, { useEffect, useState } from "react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import BigCard from "../components/todo/BigCard";
import { apiRequest } from "../api";

function Todo() {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch categories
      const cats = await apiRequest("/todos/categories");
      setCategories(cats);

      // 2️⃣ Fetch tasks for each category in parallel
      const taskPromises = cats.map(cat =>
        apiRequest(`/todos/categories/${cat._id}/tasks`)
      );
      const tasksArrays = await Promise.all(taskPromises);
      setTasks(tasksArrays.flat()); // merge all tasks into a single array

    } catch (err) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const handleAddCategory = async (name) => {
    if (!name.trim()) return;
    try {
      const category = await apiRequest("/todos/categories", "POST", { name });
      setCategories([...categories, category]);
    } catch (err) {
      console.error("Error creating category:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <NavbarLeft /> */}
      <div className="flex-1 flex flex-col">
        {/* <NavbarTop /> */}
        <main className="p-6 overflow-hidden">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <BigCard
              categories={categories}
              tasks={tasks}
              onAddCategory={handleAddCategory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Todo;
