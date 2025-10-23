CREATE TABLE announcements
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    category   VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CHECK (category IN ('WATER', 'INTERNET', 'ELECTRICITY', 'MAINTENANCE', 'GENERAL')),
    CHECK (end_date >= start_date)
);

CREATE TABLE announcement_buildings
(
    announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    building_id     INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    PRIMARY KEY (announcement_id, building_id)
);

CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);
CREATE INDEX idx_announcement_buildings_announcement ON announcement_buildings(announcement_id);
CREATE INDEX idx_announcement_buildings_building ON announcement_buildings(building_id);


