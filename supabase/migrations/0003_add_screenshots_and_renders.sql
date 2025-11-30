-- Migration: Add project_screenshots and project_renders tables

-- 1. Create project_screenshots table
CREATE TABLE project_screenshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  area text NOT NULL,
  image_url text NOT NULL,
  approval_status text CHECK (approval_status IN ('pending', 'approved', 'change_requested')) DEFAULT 'pending',
  change_notes text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create project_renders table
CREATE TABLE project_renders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  area text NOT NULL,
  image_url text NOT NULL,
  approval_status text CHECK (approval_status IN ('pending', 'approved', 'change_requested')) DEFAULT 'pending',
  change_notes text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create indexes for faster lookup
CREATE INDEX idx_project_screenshots_project_id ON project_screenshots(project_id);
CREATE INDEX idx_project_screenshots_area ON project_screenshots(area);
CREATE INDEX idx_project_renders_project_id ON project_renders(project_id);
CREATE INDEX idx_project_renders_area ON project_renders(area);

-- 4. Enable RLS
ALTER TABLE project_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_renders ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - viewable and editable by project members
CREATE POLICY "Screenshots viewable by project members"
  ON project_screenshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_screenshots.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );

CREATE POLICY "Screenshots insertable by project members"
  ON project_screenshots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_screenshots.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );

CREATE POLICY "Screenshots updatable by project members"
  ON project_screenshots FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_screenshots.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );

CREATE POLICY "Renders viewable by project members"
  ON project_renders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_renders.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );

CREATE POLICY "Renders insertable by project members"
  ON project_renders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_renders.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );

CREATE POLICY "Renders updatable by project members"
  ON project_renders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_renders.project_id
      AND (client_id = auth.uid() OR designer_id = auth.uid())
    )
  );
