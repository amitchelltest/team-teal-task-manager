import KanbanColumn from "./KanbanColumn";
import './kanban.css'

/**
 * Kanban
 *
 * Kanban board component that displays KanbanColumn components
 * - Displays 5 columns: To do, Blocked, In progress, In review, Complete
 * - Columns can be scrolled through independently
 * - Tasks can be clicked to display full details
 *
 * TODO: Get tasks from database
 * TODO: Implement dragging tasks between columns
 */

function Kanban() {
    const columns = [
        { title: "To do", tasks: []},
        { title: "Blocked", tasks: []},
        { title: "In Progress", tasks: []},
        { title: "In Review", tasks: []},
        { title: "Complete", tasks: []}
    ];
    return(
        <section className={`kanban`}>
                    <div className='title'>
                        <h2>Kanban Board</h2>
                    </div>
        
                    <div className='body'>
                        {columns.length > 0 ? (
                            <>
                                {columns.map((column) => (
                                    <KanbanColumn className='kanban-column' key={column.title} title={column.title} tasks={column.tasks}/>
                                ))}
                            </>
                        ) : (
                            <p>No Columns</p>
                        )}
                    </div>
                </section>
    )
}

export default Kanban