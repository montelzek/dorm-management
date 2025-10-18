ALTER TABLE reservation_resources
    ADD COLUMN resource_type VARCHAR(50) NOT NULL DEFAULT 'STANDARD';