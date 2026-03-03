import Board from "./Board";
import { useMemo } from "react";

function Scrum({ columns = [], setColumns = () => {} }) {

    const scrumColumns = useMemo(() => {
        const hasColumn = (columnName) => {
            return columns.some(
                (column) => (column.title || column.name || "").trim().toLowerCase() === columnName,
            );
        }
        
        if (columns.length === 0) return columns;

        if (!hasColumn("backlog") || !hasColumn("todo")) {
            throw new Error("Scrum board requires exactly one 'Backlog' column, and one 'Todo' column.");
        }

        return columns;
    }, [columns]);

    return (
        <Board
            columns={scrumColumns}
            setColumns={setColumns}
            boardTitle="Scrum Board"
            emptyColumnsText="No Columns"
        />
    )
}

export default Scrum;