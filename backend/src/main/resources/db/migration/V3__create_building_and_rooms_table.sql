CREATE TABLE buildings
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    address    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms
(
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES buildings (id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    capacity    INTEGER NOT NULL DEFAULT 2,
    rent_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (building_id, room_number)
);

ALTER TABLE users
    ADD CONSTRAINT fk_users_room
        FOREIGN KEY (room_id)
            REFERENCES rooms (id)
            ON DELETE SET NULL;