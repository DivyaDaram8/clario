import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";
import { PRIORITY_ORDER } from "../utils/priority"; // make sure it's exported

// helper: sort tasks by completed, priority, orderIndex
function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return (a.orderIndex || 0) - (b.orderIndex || 0);
  });
}

export default function useTodos() {
  const [categories, setCategories] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  // load categories + tasks
  const loadTasksForDate = useCallback(async (date = selectedDate) => {
    setLoading(true);
    try {
      const cats = await apiRequest("/todos/categories");
      setCategories(cats);

      const promises = cats.map((c) =>
        apiRequest(`/todos/categories/${c._id}/tasks?date=${date}`)
          .then((tasks) => ({ catId: c._id, tasks }))
          .catch(() => ({ catId: c._id, tasks: [] }))
      );

      const results = await Promise.all(promises);
      const map = {};
      results.forEach((r) => {
        map[r.catId] = sortTasks(r.tasks);
      });
      setTasksByCategory(map);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [loadTasksForDate, selectedDate]);

  // CRUD
  async function createCategory(payload) {
    const cat = await apiRequest("/todos/categories", "POST", payload);
    setCategories((prev) => [cat, ...prev]);
    setTasksByCategory((prev) => ({ ...prev, [cat._id]: [] }));
    return cat;
  }

  async function deleteCategory(categoryId) {
    await apiRequest(`/todos/categories/${categoryId}`, "DELETE");
    setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    setTasksByCategory((prev) => {
      const newMap = { ...prev };
      delete newMap[categoryId];
      return newMap;
    });
  }

async function createTask(categoryId, payload) {
  const task = await apiRequest(
    `/todos/categories/${categoryId}/tasks`,
    "POST",
    { ...payload, taskDate: new Date(selectedDate) }  // ✅ correct
  );

  setTasksByCategory((prev) => {
    const arr = prev[categoryId] ? [...prev[categoryId], task] : [task];
    return { ...prev, [categoryId]: sortTasks(arr) };
  });
  return task;
}



  async function updateTask(taskId, payload) {
    const updated = await apiRequest(`/todos/tasks/${taskId}`, "PUT", payload);
    setTasksByCategory((prev) => {
      const newMap = {};
      for (const k in prev) {
        newMap[k] = sortTasks(prev[k].map((t) => (t._id === taskId ? updated : t)));
      }
      return newMap;
    });
    return updated;
  }

  async function deleteTask(taskId, categoryId) {
    await apiRequest(`/todos/tasks/${taskId}`, "DELETE");
    setTasksByCategory((prev) => {
      const arr = prev[categoryId]?.filter((t) => t._id !== taskId) || [];
      const updatedArr = arr.map((t, i) => ({ ...t, orderIndex: i }));
      return { ...prev, [categoryId]: sortTasks(updatedArr) };
    });
  }

const reorder = async (categoryId, newArr) => {
  // update state immediately so UI feels snappy
  setTasksByCategory(prev => ({
    ...prev,
    [categoryId]: newArr
  }));

  // prepare payload for backend
  const ops = newArr.map((t, i) => ({ id: t._id, orderIndex: i }));

  // send to backend
  await apiRequest(
    `/todos/categories/${categoryId}/tasks/reorder`,
    "PUT",
    { tasks: ops, date: selectedDate }   // ✅ include date
  );
};

  return {
    categories,
    tasksByCategory,
    selectedDate,
    setSelectedDate,
    loading,
    createCategory,
    deleteCategory,
    createTask,
    updateTask,
    deleteTask,
    reorder,
  };
}
