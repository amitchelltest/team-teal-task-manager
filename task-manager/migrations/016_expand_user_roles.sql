PRAGMA foreign_keys = OFF;

-- Expand Users.role allowed values to include ai-team and professor.
-- SQLite/D1 does not support altering an existing CHECK constraint in place,
-- so rebuild the table and copy data.
CREATE TABLE IF NOT EXISTS Users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    timezone TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL DEFAULT 'developer'
        CHECK (role IN ('admin', 'developer', 'clinician', 'ai-team', 'professor'))
);

INSERT INTO Users_new (id, display_name, email, timezone, created_at, updated_at, role)
SELECT id, display_name, email, timezone, created_at, updated_at, role
FROM Users;

DROP TABLE Users;
ALTER TABLE Users_new RENAME TO Users;

PRAGMA foreign_keys = ON;
