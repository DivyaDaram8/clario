import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";
import { sortTasks } from "../utils/priority";

export default function useTodos() {
  const [categories, setCategories] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState({}); // { categoryId: [tasks] }
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0,10); // YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/todos/categories");
      setCategories(res);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }, []);

  const loadTasksForDate = useCallback(async (date = selectedDate) => {
    try {
      setLoading(true);
      // get all categories first then fetch tasks per category
      const catRes = await apiRequest("/todos/categories");
      setCategories(catRes);

      // parallel fetch for category tasks
      const promises = catRes.map(c =>
        apiRequest(`/todos/categories/${c._id}/tasks?date=${date}`)
          .then(tasks => ({ catId: c._id, tasks }))
          .catch(() => ({ catId: c._id, tasks: [] }))
      );
      const results = await Promise.all(promises);
      const map = {};
      results.forEach(r => map[r.catId] = sortTasks(r.tasks));
      setTasksByCategory(map);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }, [selectedDate]);

  useEffect(() => { loadTasksForDate(selectedDate); }, [loadTasksForDate, selectedDate]);

  async function createCategory(payload) {
    const cat = await apiRequest("/todos/categories", "POST", payload);
    setCategories(prev => [cat, ...prev]);
    // initialize empty list
    setTasksByCategory(prev => ({ ...prev, [cat._id]: [] }));
    return cat;
  }

  async function createTask(categoryId, payload) {
    const task = await apiRequest(`/todos/categories/${categoryId}/tasks`, "POST", payload);
    setTasksByCategory(prev => {
      const arr = prev[categoryId] ? [...prev[categoryId], task] : [task];
      return { ...prev, [categoryId]: sortTasks(arr) };
    });
    return task;
  }

  async function updateTask(taskId, payload) {
    const updated = await apiRequest(`/todos/tasks/${taskId}`, "PUT", payload);
    setTasksByCategory(prev => {
      const newMap = {};
      for (const k in prev) {
        newMap[k] = prev[k].map(t => t._id === updated._id ? updated : t);
      }
      return newMap;
    });
    return updated;
  }

  async function deleteTask(taskId, categoryId) {
    await apiRequest(`/todos/tasks/${taskId}`, "DELETE");
    setTasksByCategory(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(t => t._id !== taskId)
    }));
  }

  // reorder locally, then call server (optimistic)
  async function reorder(categoryId, newOrderArray) {
    // newOrderArray: array of task objects in order with orderIndex set
    setTasksByCategory(prev => ({ ...prev, [categoryId]: [...newOrderArray] }));
    try {
      const ops = newOrderArray.map((t, idx) => ({ id: t._id, orderIndex: idx }));
      await apiRequest(`/todos/categories/${categoryId}/tasks/reorder`, "PUT", { tasks: ops });
    } catch (err) {
      // if server fails, reload from server
      await loadTasksForDate(selectedDate);
      setError(err.message || "Failed to reorder");
    }
  }

  return {
    categories, tasksByCategory, selectedDate, setSelectedDate,
    loading, error,
    loadCategories, loadTasksForDate,
    createCategory, createTask, updateTask, deleteTask, reorder
  };
}
