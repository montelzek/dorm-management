-- Add assigned_technician_id column to issues table
ALTER TABLE issues
ADD COLUMN assigned_technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_issues_assigned_technician ON issues(assigned_technician_id);
