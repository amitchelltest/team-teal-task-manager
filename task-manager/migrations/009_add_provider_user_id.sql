PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
ALTER TABLE User_Providers ADD COLUMN provider_user_id TEXT;
COMMIT;
PRAGMA foreign_keys = ON;