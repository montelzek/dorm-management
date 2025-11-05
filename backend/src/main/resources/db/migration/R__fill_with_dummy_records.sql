INSERT INTO buildings (id, name, address, created_at, updated_at)
VALUES
    (1, 'Building A', '10 Academic Street, Warsaw, 00-001', NOW(), NOW()),
    (2, 'Building B', '25 Student Avenue, Kraków, 30-001', NOW(), NOW()),
    (3, 'Building C', '5 Dormitory Lane, Wrocław, 50-001', NOW(), NOW());

-- Reset the buildings sequence to continue from the last inserted ID
SELECT setval('buildings_id_seq', (SELECT MAX(id) FROM buildings));

-- Insert sample rooms (2-4 per building)
INSERT INTO rooms (building_id, room_number, capacity, created_at, updated_at)
VALUES
    -- Building A (ID = 1)
    (1, 'A101', 2, NOW(), NOW()),
    (1, 'A102', 3, NOW(), NOW()),
    (1, 'A201', 2, NOW(), NOW()),
    (1, 'A202', 4, NOW(), NOW()),

    -- Building B (ID = 2)
    (2, 'B101', 2, NOW(), NOW()),
    (2, 'B102', 2, NOW(), NOW()),
    (2, 'B201', 3, NOW(), NOW()),

    -- Building C (ID = 3)
    (3, 'C101', 2, NOW(), NOW()),
    (3, 'C102', 2, NOW(), NOW()),
    (3, 'C103', 3, NOW(), NOW());

-- Insert sample reservation resources (laundry, common rooms, etc.)
INSERT INTO reservation_resources (name, building_id, description, is_active, resource_type, created_at, updated_at)
VALUES
    -- Building A
    ('Laundry Room A', 1, 'Ground floor laundry with 4 machines', true, 'LAUNDRY', NOW(), NOW()),
    ('Study Room A', 1, 'Quiet study space with desks and Wi-Fi', true, 'STANDARD', NOW(), NOW()),
    ('Common Lounge A', 1, 'TV, sofas, and kitchenette', true, 'STANDARD', NOW(), NOW()),

    -- Building B
    ('Laundry Room B', 2, 'Basement laundry area', true, 'LAUNDRY', NOW(), NOW()),
    ('Game Room B', 2, 'Pool table, foosball, and board games', true, 'STANDARD', NOW(), NOW()),

    -- Building C
    ('Laundry Room C', 3, 'Modern laundry with dryers', true, 'LAUNDRY', NOW(), NOW()),
    ('Meeting Room C', 3, 'For group projects and meetings', true, 'STANDARD', NOW(), NOW());


INSERT INTO users (email, password, first_name, last_name, phone, room_id)
VALUES
    ('admin@admin.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Tomasz', 'Gawin', 689456235, null),
    ('resident@resident.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Maciej', 'Lis', 689456235, 1),
    ('technician@technician.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Karol', 'Oliwiak', 689456235, null),
    ('receptionist@receptionist.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Azja', 'Zpasja', 689456235, null),
    ('anna.kowalska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Anna', 'Kowalska', 600123456, null),
    ('piotr.nowak@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Piotr', 'Nowak', 601234567, null),
    ('julia.mazur@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Julia', 'Mazur', 602345678, null),
    ('michal.wozniak@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Michał', 'Woźniak', 603456789, null),
    ('katarzyna.lewandowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Katarzyna', 'Lewandowska', 604567890, null),
    ('pawel.wisniewski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Paweł', 'Wiśniewski', 605678901, null),
    ('magdalena.zielinska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Magdalena', 'Zielińska', 606789012, null),
    ('bartosz.kaczmarek@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Bartosz', 'Kaczmarek', 607890123, null),
    ('alicja.piotrowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Alicja', 'Piotrowska', 608901234, null),
    ('jakub.kowalczyk@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jakub', 'Kowalczyk', 609012345, null);

INSERT INTO user_roles (user_id, role_name)
VALUES
    (1, 'ROLE_ADMIN'),
    (2, 'ROLE_RESIDENT'),
    (3, 'ROLE_TECHNICIAN'),
    (4, 'ROLE_RECEPTIONIST'),
    (5, 'ROLE_RESIDENT'),
    (6, 'ROLE_RESIDENT'),
    (7, 'ROLE_RESIDENT'),
    (8, 'ROLE_RESIDENT'),
    (9, 'ROLE_RESIDENT'),
    (10, 'ROLE_RESIDENT'),
    (11, 'ROLE_RESIDENT'),
    (12, 'ROLE_RESIDENT'),
    (13, 'ROLE_RESIDENT'),
    (14, 'ROLE_RESIDENT');

-- Insert sample announcements
INSERT INTO announcements (title, content, category, start_date, end_date, created_at, updated_at)
VALUES
    ('Water Maintenance - Building A', 'Water will be shut off in Building A on Saturday from 8 AM to 2 PM for maintenance work. Please plan accordingly.', 'WATER', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', NOW(), NOW()),
    ('Internet Upgrade This Week', 'We are upgrading the internet infrastructure. You may experience brief interruptions during off-peak hours.', 'INTERNET', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', NOW(), NOW()),
    ('Power Outage Notice - Building B', 'Scheduled power outage in Building B on Sunday from 6 AM to 10 AM for electrical inspection.', 'ELECTRICITY', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', NOW(), NOW()),
    ('Elevator Maintenance', 'The elevator in Building C will be under maintenance from Monday to Wednesday. Please use the stairs.', 'MAINTENANCE', CURRENT_DATE, CURRENT_DATE + INTERVAL '10 days', NOW(), NOW()),
    ('Community Meeting Next Week', 'Join us for the monthly community meeting next Thursday at 7 PM in the Common Lounge A. Pizza will be served!', 'GENERAL', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', NOW(), NOW()),
    ('Heating System Check', 'Annual heating system inspection will take place next month. No interruption to service expected.', 'MAINTENANCE', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '30 days', NOW(), NOW());

-- Link announcements to buildings
INSERT INTO announcement_buildings (announcement_id, building_id)
VALUES
    (1, 1),  -- Water maintenance in Building A
    (3, 2),  -- Power outage in Building B
    (4, 3),  -- Elevator maintenance in Building C
    (5, 1),  -- Community meeting in Building A
    (5, 2),  -- Community meeting also for Building B
    (6, 1),  -- Heating check in Building A
    (6, 2),  -- Heating check in Building B
    (6, 3);  -- Heating check in Building C

-- Note: Announcements 2 (Internet Upgrade) has no building assignment, making it global for all residents

-- Insert sample marketplace listings
INSERT INTO marketplace_listings (user_id, title, description, listing_type, category, price, image_filenames, created_at, updated_at)
VALUES
    (2, 'Calculus Textbook for Sale', 'Used calculus textbook in good condition. All chapters intact, minimal highlighting. Perfect for Math 101.', 'SELL', 'TEXTBOOKS', 45.00, '[]'::jsonb, NOW(), NOW()),
    (5, 'Looking for Chemistry Lab Manual', 'Need to buy Chemistry Lab Manual for second semester. Willing to pay good price if in decent condition.', 'BUY', 'TEXTBOOKS', 30.00, '[]'::jsonb, NOW(), NOW()),
    (6, 'IKEA Desk and Chair Set', 'Moving out, selling my desk and chair. Very sturdy, bought 6 months ago. Pickup only from Building B.', 'SELL', 'FURNITURE', 120.00, '[]'::jsonb, NOW(), NOW()),
    (7, 'Gaming Laptop - RTX 3060', 'Selling my gaming laptop. RTX 3060, 16GB RAM, 512GB SSD. Great for gaming and programming. Reason for selling: upgraded to desktop.', 'SELL', 'ELECTRONICS', 850.00, '[]'::jsonb, NOW(), NOW()),
    (8, 'Need Mini Fridge', 'Looking to buy a mini fridge for my dorm room. Budget around 100 PLN. Please contact if you have one available.', 'BUY', 'ELECTRONICS', 100.00, '[]'::jsonb, NOW(), NOW()),
    (9, 'Bookshelf - 5 Shelves', 'White bookshelf with 5 shelves. Great condition. Must pick up from Building C, Room C102.', 'SELL', 'FURNITURE', 80.00, '[]'::jsonb, NOW(), NOW()),
    (10, 'Physics Textbook Bundle', 'Selling complete physics textbook bundle - Physics I, II, and Lab Manual. All three for one price. Saved me last year!', 'SELL', 'TEXTBOOKS', 90.00, '[]'::jsonb, NOW(), NOW()),
    (11, 'Wireless Headphones', 'Sony WH-1000XM4 noise-cancelling headphones. Barely used, comes with original box and accessories.', 'SELL', 'ELECTRONICS', 200.00, '[]'::jsonb, NOW(), NOW()),
    (12, 'Desk Lamp and Organizer', 'LED desk lamp with USB charging port + desk organizer. Both items together. Perfect for studying late nights.', 'SELL', 'OTHER', 35.00, '[]'::jsonb, NOW(), NOW()),
    (13, 'Looking for Study Desk', 'Need a sturdy desk for my room. Budget up to 150 PLN. Preferably with drawers. Can pick up from any building.', 'BUY', 'FURNITURE', 150.00, '[]'::jsonb, NOW(), NOW());