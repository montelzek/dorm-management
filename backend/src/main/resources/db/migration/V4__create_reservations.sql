CREATE TABLE reservation_resources
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    building_id INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    description TEXT,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservations
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id INTEGER NOT NULL REFERENCES reservation_resources(id) ON DELETE CASCADE,
    start_time  TIMESTAMP NOT NULL,
    end_time    TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status      VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    CHECK (end_time > start_time)
);