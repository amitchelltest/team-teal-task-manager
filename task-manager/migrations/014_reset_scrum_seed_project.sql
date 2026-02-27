PRAGMA foreign_keys = ON;

-- Ensure at least one user exists for required FK fields.
INSERT INTO Users (display_name, email, timezone)
SELECT 'Seed User', 'seed.user@example.com', 'UTC'
WHERE NOT EXISTS (SELECT 1 FROM Users);

-- Delete existing Scrum seed project (cascades to Columns/Tasks/Comments).
DELETE FROM Projects
WHERE id = 4;

-- Recreate Scrum seed project.
INSERT INTO Projects (id, name, created_by, type)
VALUES (
  4,
  'Scrum Seed Project',
  (SELECT id FROM Users ORDER BY id LIMIT 1),
  'scrum'
);

-- Recreate Scrum columns.
INSERT INTO Columns (id, project_id, name, key, position)
VALUES
  (100, 4, 'Backlog', 'backlog', 1),
  (101, 4, 'In Progress', 'in_progress', 2),
  (102, 4, 'Blocked', 'blocked', 3),
  (103, 4, 'Done', 'done', 4);

-- Recreate sample Scrum tasks.
INSERT INTO Tasks (
  id, project_id, column_id, sprint_id, reporter_id, assignee_id, created_by, modified_by,
  title, description, start_date, due_date, position
)
VALUES
  (
    1000,
    4,
    100,
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    'Backlog: Epic planning',
    'Outline high-level epics',
    NULL,
    NULL,
    0
  ),
  (
    1001,
    4,
    100,
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    NULL,
    'Backlog: User research',
    'Collect user interviews',
    NULL,
    NULL,
    1
  ),
  (
    1002,
    4,
    101,
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    'Implement login flow',
    'Add OAuth and session handling',
    '2026-02-01',
    '2026-02-10',
    0
  ),
  (
    1003,
    4,
    102,
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    'Fix signup bug',
    'Resolve validation error on submit',
    NULL,
    NULL,
    0
  ),
  (
    1004,
    4,
    103,
    NULL,
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    (SELECT id FROM Users ORDER BY id LIMIT 1),
    'Release v1.0',
    'Prepare release notes and tag',
    NULL,
    NULL,
    0
  );
