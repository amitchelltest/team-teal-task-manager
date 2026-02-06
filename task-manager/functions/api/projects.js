import { makeCrudHandlers } from "./helpers";

// Use the generic CRUD handlers for the Projects collection endpoint
const projectHandlers = makeCrudHandlers({
    table: "projects",
    primaryKey: "id",
    allowedColumns: ["name", "created_by", "status", "created_at", "updated_at"],
    dbEnvVar: "cf_db",
    orderBy: "id ASC",
});

export const onRequestGet = projectHandlers.collection;
export const onRequestPost = projectHandlers.collection;
export const onRequestOptions = projectHandlers.collection;