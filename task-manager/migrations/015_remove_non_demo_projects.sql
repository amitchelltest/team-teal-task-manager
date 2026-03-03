PRAGMA foreign_keys = ON;

DELETE FROM Projects
WHERE name NOT IN ('Demo Project', 'Scrum Sample Project');
