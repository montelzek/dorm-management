INSERT INTO buildings (id, name, address, created_at, updated_at)
VALUES
    (1, 'Building A', '10 Academic Street, Warsaw, 00-001', NOW(), NOW()),
    (2, 'Building B', '25 Student Avenue, Kraków, 30-001', NOW(), NOW()),
    (3, 'Building C', '5 Dormitory Lane, Wrocław, 50-001', NOW(), NOW());

-- Insert sample rooms (2-4 per building)
INSERT INTO rooms (building_id, room_number, capacity, rent_amount, created_at, updated_at)
VALUES
    -- Building A (ID = 1)
    (1, 'A101', 2, 800.00, NOW(), NOW()),
    (1, 'A102', 3, 750.00, NOW(), NOW()),
    (1, 'A201', 2, 850.00, NOW(), NOW()),
    (1, 'A202', 4, 700.00, NOW(), NOW()),

    -- Building B (ID = 2)
    (2, 'B101', 2, 820.00, NOW(), NOW()),
    (2, 'B102', 2, 820.00, NOW(), NOW()),
    (2, 'B201', 3, 770.00, NOW(), NOW()),

    -- Building C (ID = 3)
    (3, 'C101', 2, 790.00, NOW(), NOW()),
    (3, 'C102', 2, 790.00, NOW(), NOW()),
    (3, 'C103', 3, 740.00, NOW(), NOW());

-- Insert sample reservation resources (laundry, common rooms, etc.)
INSERT INTO reservation_resources (name, building_id, description, is_active, created_at, updated_at)
VALUES
    -- Building A
    ('Laundry Room A', 1, 'Ground floor laundry with 4 machines', true, NOW(), NOW()),
    ('Study Room A', 1, 'Quiet study space with desks and Wi-Fi', true, NOW(), NOW()),
    ('Common Lounge A', 1, 'TV, sofas, and kitchenette', true, NOW(), NOW()),

    -- Building B
    ('Laundry Room B', 2, 'Basement laundry area', true, NOW(), NOW()),
    ('Game Room B', 2, 'Pool table, foosball, and board games', true, NOW(), NOW()),

    -- Building C
    ('Laundry Room C', 3, 'Modern laundry with dryers', true, NOW(), NOW()),
    ('Meeting Room C', 3, 'For group projects and meetings', true, NOW(), NOW()),

    -- Shared / building-independent
    ('Sports Hall', 2, 'University sports hall – book for basketball or volleyball', true, NOW(), NOW()),
    ('Music Practice Room', 3, 'Soundproof room with piano', true, NOW(), NOW());