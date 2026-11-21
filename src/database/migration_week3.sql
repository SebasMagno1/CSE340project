-- Week 03 database migration.
-- This migration preserves existing records.

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS project_date DATE,
    ADD COLUMN IF NOT EXISTS project_location VARCHAR(150);

-- Assign dates to existing projects.
UPDATE projects
SET project_date = CURRENT_DATE + (project_id * 7)
WHERE project_date IS NULL;

-- Assign a default location.
UPDATE projects
SET project_location = 'Location to be announced'
WHERE project_location IS NULL;

-- Make both columns required.
ALTER TABLE projects
    ALTER COLUMN project_date SET NOT NULL,
    ALTER COLUMN project_location SET NOT NULL;