ALTER TABLE events DROP COLUMN IF EXISTS room_id;
ALTER TABLE events ADD COLUMN resource_id INTEGER REFERENCES reservation_resources(id) ON DELETE SET NULL;

CREATE INDEX idx_events_resource ON events(resource_id);

