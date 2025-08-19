import React from "react";
import TaskCard from "./TaskCard";
import { sortTasks } from "../../utils/priority";

export default function KanbanBoard({ categories, tasksByCategory, onToggleDone, onEdit, onReorder }) {

  function handleDragStart(e, catId, idx) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ catId, idx }));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e, destCatId, destIdx) {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { catId: srcCatId, idx: srcIdx } = payload;

    if (srcCatId === destCatId && srcIdx === destIdx) return;

    const srcList = [...(tasksByCategory[srcCatId] || [])];
    const destList = [...(tasksByCategory[destCatId] || [])];

    const [moved] = srcList.splice(srcIdx, 1);
    destList.splice(destIdx, 0, moved);

    // recalc orderIndex
    const updatedDest = destList.map((t, i) => ({ ...t, orderIndex: i }));
    const updatedSrc = srcCatId === destCatId ? updatedDest : srcList.map((t, i) => ({ ...t, orderIndex: i }));

    // call reorder for both categories if moved across
    onReorder(srcCatId, updatedSrc);
    if (srcCatId !== destCatId) onReorder(destCatId, updatedDest);
  }

  function allowDrop(e) { e.preventDefault(); }

  return (
    <div className="flex gap-4 overflow-auto p-4">
      {categories.map(cat => {
        const tasks = sortTasks(tasksByCategory[cat._id] || []);
        return (
          <div key={cat._id} className="min-w-[320px] bg-white/3 p-3 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ backgroundColor: cat.color }} className="w-8 h-8 rounded-md flex items-center justify-center text-sm">{cat.icon || cat.name[0]}</div>
                <div className="font-semibold">{cat.name}</div>
              </div>
              <div className="text-xs text-gray-300">{tasks.length}</div>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.map((t, idx) => (
                <div
                  key={t._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cat._id, idx)}
                  onDrop={(e) => handleDrop(e, cat._id, idx)}
                  onDragOver={allowDrop}
                >
                  <TaskCard task={t} onToggleDone={onToggleDone} onEdit={onEdit} />
                </div>
              ))}

              {/* empty drop area at end of list */}
              <div
                onDrop={(e) => handleDrop(e, cat._id, tasks.length)}
                onDragOver={allowDrop}
                className="h-8"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
