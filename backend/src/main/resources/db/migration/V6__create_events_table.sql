CREATE TABLE events
(
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    event_date    DATE NOT NULL,
    start_time    TIME NOT NULL,
    end_time      TIME NOT NULL,
    building_id   INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
    room_id       INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    
    CHECK (end_time > start_time)
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_building ON events(building_id);

