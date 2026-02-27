import Board from "./Board";
import { useMemo } from "react";

function Scrum({ columns = [], setColumns = () => {} }) {
    const scrumColumns = useMemo(() => {
        if (columns.length === 0) return columns;

        const hasBacklog = columns.some(
            (column) => (column.title || column.name || "").trim().toLowerCase() === "backlog",
        );

        if (!hasBacklog) {
            throw new Error("Scrum board requires exactly one 'Backlog' column.");
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