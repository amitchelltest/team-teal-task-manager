import Board from "./Board";
import { useMemo } from "react";

function Scrum({ columns = [], setColumns = () => {} }) {
    const scrumColumns = useMemo(() => {
        const hasBacklog = columns.some(
            (column) => (column.title || "").trim().toLowerCase() === "backlog",
        );

        if (hasBacklog) return columns;

        return [
            {
                id: "backlog",
                title: "backlog",
                tasks: [],
            },
            ...columns,
        ];
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