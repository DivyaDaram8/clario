import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

export default function useTodos() {
  const [categories, setCategories] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);

  // Load categories
  const loadCategories = useCallback(async () => {
    const res = await apiRequest("/todos/categories");
    setCategories(res);
  }, []);

  // Load tasks for selected date
  const loadTasksForDate = useCallback(async (date = selectedDate) => {
    setLoading(true);
    try {
      const categoriesRes = await apiRequest("/todos/categories");
      setCategories(categoriesRes);

      const promises = categoriesRes.map(c =>
        apiRequest(`/todos/categories/${c._id}/tasks?date=${date}`)
          .then(tasks => ({ catId: c._id, tasks }))
          .catch(() => ({ catId: c._id, tasks: [] }))
      );

      const results = await Promise.all(promises);
      const map = {};
      results.forEach(r => {
        const sorted = [...r.tasks].sort((a,b)=>{
          if(a.completed !== b.completed) return a.completed ? 1 : -1;
          return (a.orderIndex || 0) - (b.orderIndex || 0);
        });
        map[r.catId] = sorted;
      });
      setTasksByCategory(map);
    } finally { setLoading(false); }
  }, [selectedDate]);

  useEffect(() => { loadTasksForDate(selectedDate); }, [loadTasksForDate, selectedDate]);

  // CRUD functions
  async function createCategory(payload) {
    const cat = await apiRequest("/todos/categories", "POST", payload);
    setCategories(prev => [cat, ...prev]);
    setTasksByCategory(prev => ({ ...prev, [cat._id]: [] }));
    return cat;
  }

  async function deleteCategory(categoryId) {
    await apiRequest(`/todos/categories/${categoryId}`, "DELETE");
    setCategories(prev => prev.filter(c => c._id !== categoryId));
    setTasksByCategory(prev => {
      const newMap = { ...prev };
      delete newMap[categoryId];
      return newMap;
    });
  }

  async function createTask(categoryId, payload) {
    const task = await apiRequest(`/todos/categories/${categoryId}/tasks`, "POST", payload);
    setTasksByCategory(prev => {
      const arr = prev[categoryId] ? [...prev[categoryId], task] : [task];
      const sorted = arr.sort((a,b)=>{
        if(a.completed !== b.completed) return a.completed ? 1 : -1;
        return (a.orderIndex || 0) - (b.orderIndex || 0);
      });
      return { ...prev, [categoryId]: sorted };
    });
    return task;
  }

  async function updateTask(taskId, payload) {
    const updated = await apiRequest(`/todos/tasks/${taskId}`, "PUT", payload);
    setTasksByCategory(prev => {
      const newMap = {};
      for (const k in prev) {
        let arr = prev[k].map(t => t._id === updated._id ? updated : t);
        arr = arr.sort((a,b)=>{
          if(a.completed !== b.completed) return a.completed ? 1 : -1;
          return (a.orderIndex || 0) - (b.orderIndex || 0);
        });
        newMap[k] = arr;
      }
      return newMap;
    });
    return updated;
  }

  async function deleteTask(taskId, categoryId) {
    await apiRequest(`/todos/tasks/${taskId}`, "DELETE");
    setTasksByCategory(prev => {
      const arr = prev[categoryId].filter(t => t._id !== taskId)
        .map((t,i)=>({...t, orderIndex:i}));
      return { ...prev, [categoryId]: arr };
    });
  }

  async function reorder(categoryId, newOrderArray) {
    setTasksByCategory(prev => ({ ...prev, [categoryId]: [...newOrderArray] }));
    const ops = newOrderArray.map((t,i)=>({id:t._id, orderIndex:i}));
    await apiRequest(`/todos/categories/${categoryId}/tasks/reorder`, "PUT", { tasks: ops });
  }

  return {
    categories, tasksByCategory, selectedDate, setSelectedDate,
    loading, createCategory, deleteCategory, createTask,
    updateTask, deleteTask, reorder
  };
}
