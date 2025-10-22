CREATE TABLE issues
(
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id       INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    building_id   INTEGER REFERENCES buildings(id) ON DELETE SET NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'REPORTED',
    priority      VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    
    CHECK (status IN ('REPORTED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED')),
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'))
);