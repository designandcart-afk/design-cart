-- Migration: Add areas column to projects and create project_areas table

-- 1. Add areas column to projects (as text[])
ALTER TABLE projects ADD COLUMN areas text[];

-- 2. Create project_areas table
CREATE TABLE project_areas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  area_name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Index for faster lookup by project_id
CREATE INDEX idx_project_areas_project_id ON project_areas(project_id);
