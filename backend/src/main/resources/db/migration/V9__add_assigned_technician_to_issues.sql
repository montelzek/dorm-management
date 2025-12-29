ALTER TABLE issues
ADD COLUMN assigned_technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_issues_assigned_technician ON issues(assigned_technician_id);
