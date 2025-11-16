// ========== KANBAN BOARD ==========
import React from "react";
import TaskCard from "./TaskCard";

export default function KanbanBoard({
  categories,
  tasksByCategory,
  onToggleDone,
  onEdit,
  onDelete,
  onReorder
}) {

  function handleDragStart(e, catId, idx) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ catId, idx }));
  }

  function handleDrop(e, catId, destIdx) {
    e.preventDefault();
    const { catId: srcCatId, idx: srcIdx } = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (srcCatId !== catId) return;
    if (srcIdx === destIdx) return;

    const list = [...tasksByCategory[catId]];
    const moved = list[srcIdx];
    const destTask = list[destIdx];
    
    if (destTask && destTask.priority !== moved.priority) {
      alert("You can only reorder tasks within the same priority group!");
      return;
    }

    list.splice(srcIdx, 1);
    list.splice(destIdx, 0, moved);

    const updatedList = list.map((t) => {
      if (t.priority === moved.priority) {
        const samePriorityTasks = list.filter(x => x.priority === t.priority);
        return { ...t, orderIndex: samePriorityTasks.indexOf(t) };
      }
      return t;
    });

    onReorder(catId, updatedList);
  }

  return (
    <div className="kanban-container">
      {categories.map((cat) => (
        <div key={cat._id} className="kanban-column">
          <div className="kanban-column-header">
            <div className="column-title-group">
              <div className="column-icon">{cat.icon || cat.name[0]}</div>
              <h3 className="column-title">{cat.name}</h3>
            </div>
            <div className="column-count">{tasksByCategory[cat._id]?.length || 0}</div>
          </div>

          <div className="kanban-tasks">
            {tasksByCategory[cat._id]?.map((t, idx) => (
              <div 
                key={t._id} 
                draggable
                onDragStart={e => handleDragStart(e, cat._id, idx)}
                onDrop={e => handleDrop(e, cat._id, idx)}
                onDragOver={e => e.preventDefault()}
              >
                <TaskCard
                  task={t}
                  onToggleDone={onToggleDone}
                  onEdit={onEdit}
                  onDelete={task => onDelete(task, cat._id)}
                />
              </div>
            ))}
            <div 
              onDrop={e => handleDrop(e, cat._id, tasksByCategory[cat._id]?.length || 0)}
              onDragOver={e => e.preventDefault()}
              className="kanban-drop-zone"
            />
          </div>
        </div>
      ))}
    </div>
  );
}