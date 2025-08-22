export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return (a.orderIndex || 0) - (b.orderIndex || 0);
  });
}
