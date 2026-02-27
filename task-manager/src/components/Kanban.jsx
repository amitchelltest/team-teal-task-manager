import Board from "./Board";
import KanbanColumn from "./KanbanColumn";
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
  return (
    <Board
      columns={columns}
      setColumns={setColumns}
      boardTitle="Kanban Board"
      emptyColumnsText="No Columns"
    />
  )
}

export default Kanban;
