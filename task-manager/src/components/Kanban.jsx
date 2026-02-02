import KanbanColumn from "./KanbanColumn";
import './kanban.css'

function Kanban() {
    const tasks1 = [
        { id: 1, title: "Test1"},
        { id: 2, title: "Test2"},
        { id: 3, title: "Test3"},
        { id: 4, title: "Test4"},
        { id: 5, title: "Test5"}
    ];
    const columns = [
        { title: "To do", tasks: tasks1},
        { title: "Blocked", tasks: tasks1},
        { title: "In Progress", tasks: tasks1},
        { title: "In Review", tasks: tasks1},
        { title: "Complete", tasks: tasks1}
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