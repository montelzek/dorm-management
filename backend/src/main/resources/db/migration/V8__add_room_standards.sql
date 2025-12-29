CREATE TABLE IF NOT EXISTS room_standards (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'rooms' AND column_name = 'room_standard_id'
    ) THEN
        ALTER TABLE rooms ADD COLUMN room_standard_id BIGINT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_rooms_room_standard'
    ) THEN
        ALTER TABLE rooms
            ADD CONSTRAINT fk_rooms_room_standard
            FOREIGN KEY (room_standard_id) REFERENCES room_standards(id);
    END IF;
END$$;

ALTER TABLE rooms
    DROP COLUMN IF EXISTS rent_amount;
