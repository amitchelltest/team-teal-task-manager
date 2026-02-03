import KanbanColumn from "./KanbanColumn";
import "./kanban.css";
import { DragDropContext } from "@hello-pangea/dnd";
/**
 * Kanban
 *
 * Kanban board component that displays KanbanColumn components
 * - Displays columns and tasks
 * - Columns can be scrolled through independently
 * - Tasks can be clicked to display full details
 */

function Kanban({ columns = [], setColumns = () => {} }) {
  // When the dragging ends
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Capture original column and position
    const originalPositions = {};
    const originalColumnIds = {};
    columns.forEach((column) => {
      (column.tasks || []).forEach((task) => {
        if (task && task.id !== undefined) {
          originalPositions[task.id] = Number(task.position) || 0;
          originalColumnIds[task.id] = column.id;
        }
      });
    });

    const newColumns = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));
    const [movedTask] = newColumns[Number(source.droppableId)].tasks.splice(
      source.index,
      1,
    );
    newColumns[Number(destination.droppableId)].tasks.splice(
      destination.index,
      0,
      movedTask,
    );
    setColumns(newColumns);

    // Update task position and column changes in the database
    (async () => {
      try {
        const updates = [];

        newColumns.forEach((column) => {
          column.tasks.forEach((task, idx) => {
            const updatesBody = {};

            // Get original values for task
            const originalPosition = originalPositions[task.id] ?? 0;
            const originalColumn = originalColumnIds[task.id];

            // If the task changed positions, add position update to the updates body
            if (originalPosition !== idx) updatesBody.position = idx;

            // If the task changed columns, add column_id update to the updates body
            if (originalColumn !== column.id) updatesBody.column_id = column.id;

            // Push update body changes to the tasks API
            if (Object.keys(updatesBody).length > 0) {
              updates.push(
                fetch(`/api/tasks/${task.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatesBody),
                }),
              );
            }
          });
        });

        if (updates.length > 0) await Promise.all(updates);
      } catch (err) {
        console.error("Error saving task positions", err);
      }
    })();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="kanban">
        <div className="title">
          <h2>Kanban Board</h2>
        </div>
        <div className="body">
          {columns.length > 0 ? (
            <>
              {columns.map((column, colIndex) => (
                <KanbanColumn
                  key={colIndex}
                  colIndex={colIndex}
                  title={column.title}
                  tasks={column.tasks}
                />
              ))}
            </>
          ) : (
            <p>No Columns</p>
          )}
        </div>
      </section>
    </DragDropContext>
  );
}

export default Kanban;
