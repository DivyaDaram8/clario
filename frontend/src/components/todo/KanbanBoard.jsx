import React from "react";
import TaskCard from "./TaskCard";

export default function KanbanBoard({
  categories, tasksByCategory,
  onToggleDone, onEdit, onDelete, onReorder
}) {

  function handleDragStart(e, catId, idx) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ catId, idx }));
  }

  function handleDrop(e, catId, destIdx) {
    e.preventDefault();
    const { catId: srcCatId, idx: srcIdx } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if(srcCatId !== catId) return; // ❌ only same category
    if(srcIdx === destIdx) return;

    let list = [...tasksByCategory[catId]];
    const [moved] = list.splice(srcIdx, 1);
    list.splice(destIdx, 0, moved);

    list = list.map((t,i)=>({...t, orderIndex:i}));
    onReorder(catId, list);
  }

  return (
    <div className="flex gap-4 overflow-y-auto max-h-[calc(100vh-120px)] p-4">
      {categories.map((cat, i)=>(
        <div key={cat._id} className="min-w-[320px] max-w-[360px] bg-white/5 p-3 rounded-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div style={{backgroundColor:cat.color}} className="w-8 h-8 rounded-md flex justify-center items-center">{cat.icon||cat.name[0]}</div>
              <div className="font-semibold">{cat.name}</div>
            </div>
            <div className="text-xs text-gray-400">{tasksByCategory[cat._id]?.length||0}</div>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-3">
            {tasksByCategory[cat._id]?.map((t, idx)=>(
              <div key={t._id} draggable
                onDragStart={e=>handleDragStart(e, cat._id, idx)}
                onDrop={e=>handleDrop(e, cat._id, idx)}
                onDragOver={e=>e.preventDefault()}
              >
                <TaskCard
                  task={t}
                  onToggleDone={onToggleDone}
                  onEdit={onEdit}
                 onDelete={task => onDelete(task, cat._id)}

                />
              </div>
            ))}
            {/* empty drop zone */}
            <div onDrop={e=>handleDrop(e, cat._id, tasksByCategory[cat._id]?.length||0)} onDragOver={e=>e.preventDefault()} className="h-8"/>
          </div>
        </div>
      ))}
    </div>
  );
}
