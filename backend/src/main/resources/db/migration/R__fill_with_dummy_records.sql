INSERT INTO buildings (id, name, address, created_at, updated_at)
VALUES
    (1, 'DS1 Rumcajs', 'ul. Skarżyńskiego 3, 31-866 Kraków', NOW(), NOW()),
    (2, 'DS2 Leon', 'ul. Skarżyńskiego 5, 31-866 Kraków', NOW(), NOW()),
    (3, 'DS3 Bartek', 'ul. Skarżyńskiego 7, 31-866 Kraków', NOW(), NOW()),
    (4, 'DS4 Balon', 'ul. Skarżyńskiego 9, 31-866 Kraków', NOW(), NOW()),
    (5, 'DS B-1 Bydgoska', 'ul. Bydgoska 19A, 30-056 Kraków', NOW(), NOW());

-- Reset the buildings sequence to continue from the last inserted ID
SELECT setval('buildings_id_seq', (SELECT MAX(id) FROM buildings));

INSERT INTO room_standards (id, code, name, capacity, price, created_at, updated_at) VALUES
-- Single room standards
(1,'X1', 'DS1', 1, 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'X2', 'DS2 Comfort', 1, 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'X3', 'DS2 Lux', 1, 900.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'X4', 'DS3 Comfort', 1, 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'X5', 'DS Bydgoska', 1, 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Double room standards
(6, 'X6', 'DS1', 2, 550.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'X7', 'DS2 Comfort', 2, 550.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'X8', 'DS2 Lux', 2, 700.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'X9', 'DS3 Standard', 2, 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'X10', 'DS3 Comfort', 2, 550.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'X11', 'DS4', 2, 580.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'X12', 'DS Bydgoska', 2, 550.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Triple room standards
(13, 'X13', 'DS3 Standard', 3, 450.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Insert sample rooms (2-4 per building)
-- INSERT INTO rooms (building_id, room_number, capacity, created_at, updated_at)
-- VALUES
--     -- Building A (ID = 1)
--     (1, 'A101', 2, NOW(), NOW()),
--     (1, 'A102', 3, NOW(), NOW()),
--     (1, 'A201', 2, NOW(), NOW()),
--     (1, 'A202', 4, NOW(), NOW()),
--
--     -- Building B (ID = 2)
--     (2, 'B101', 2, NOW(), NOW()),
--     (2, 'B102', 2, NOW(), NOW()),
--     (2, 'B201', 3, NOW(), NOW()),
--
--     -- Building C (ID = 3)
--     (3, 'C101', 2, NOW(), NOW()),
--     (3, 'C102', 2, NOW(), NOW()),
--     (3, 'C103', 3, NOW(), NOW());




INSERT INTO rooms (id, room_number, capacity, building_id, room_standard_id, created_at, updated_at)
VALUES
    -- ==========================================================
    -- 1. DS1 Rumcajs (ID: 1) -> IDs 1-20
    -- ==========================================================
    (1, '101', 1, 1, 1, NOW(), NOW()), (2, '102', 1, 1, 1, NOW(), NOW()),
    (3, '103', 2, 1, 6, NOW(), NOW()), (4, '104', 2, 1, 6, NOW(), NOW()),
    (5, '105', 2, 1, 6, NOW(), NOW()), (6, '106', 2, 1, 6, NOW(), NOW()),
    (7, '107', 2, 1, 6, NOW(), NOW()), (8, '108', 2, 1, 6, NOW(), NOW()),
    (9, '109', 2, 1, 6, NOW(), NOW()), (10, '110', 2, 1, 6, NOW(), NOW()),
    (11, '111', 2, 1, 6, NOW(), NOW()), (12, '112', 2, 1, 6, NOW(), NOW()),
    (13, '113', 2, 1, 6, NOW(), NOW()), (14, '114', 2, 1, 6, NOW(), NOW()),
    (15, '115', 2, 1, 6, NOW(), NOW()), (16, '116', 2, 1, 6, NOW(), NOW()),
    (17, '117', 2, 1, 6, NOW(), NOW()), (18, '118', 2, 1, 6, NOW(), NOW()),
    (19, '119', 2, 1, 6, NOW(), NOW()), (20, '120', 2, 1, 6, NOW(), NOW()),

    -- ==========================================================
    -- 2. DS2 Leon (ID: 2) -> IDs 21-40
    -- ==========================================================
    (21, '101', 1, 2, 2, NOW(), NOW()), (22, '102', 1, 2, 2, NOW(), NOW()),
    (23, '103', 2, 2, 7, NOW(), NOW()), (24, '104', 2, 2, 7, NOW(), NOW()),
    (25, '105', 2, 2, 7, NOW(), NOW()), (26, '106', 2, 2, 7, NOW(), NOW()),
    (27, '107', 2, 2, 7, NOW(), NOW()), (28, '108', 2, 2, 7, NOW(), NOW()),
    (29, '109', 2, 2, 7, NOW(), NOW()), (30, '110', 2, 2, 7, NOW(), NOW()),
    (31, '111', 2, 2, 7, NOW(), NOW()), (32, '112', 2, 2, 7, NOW(), NOW()),
    (33, '113', 2, 2, 7, NOW(), NOW()), (34, '114', 2, 2, 7, NOW(), NOW()),
    (35, '115', 2, 2, 7, NOW(), NOW()), (36, '116', 2, 2, 7, NOW(), NOW()),
    (37, '117', 2, 2, 7, NOW(), NOW()), (38, '118', 2, 2, 7, NOW(), NOW()),
    (39, '119', 2, 2, 7, NOW(), NOW()), (40, '120', 2, 2, 7, NOW(), NOW()),

    -- ==========================================================
    -- 3. DS3 Bartek (ID: 3) -> IDs 41-60
    -- ==========================================================
    (41, '101', 1, 3, 4, NOW(), NOW()), (42, '102', 1, 3, 4, NOW(), NOW()),
    (43, '103', 3, 3, 13, NOW(), NOW()), (44, '104', 3, 3, 13, NOW(), NOW()),
    (45, '105', 3, 3, 13, NOW(), NOW()), (46, '106', 3, 3, 13, NOW(), NOW()),
    (47, '107', 3, 3, 13, NOW(), NOW()), (48, '108', 3, 3, 13, NOW(), NOW()),
    (49, '109', 3, 3, 13, NOW(), NOW()), (50, '110', 3, 3, 13, NOW(), NOW()),
    (51, '111', 3, 3, 13, NOW(), NOW()), (52, '112', 3, 3, 13, NOW(), NOW()),
    (53, '113', 2, 3, 9, NOW(), NOW()), (54, '114', 2, 3, 9, NOW(), NOW()),
    (55, '115', 2, 3, 9, NOW(), NOW()), (56, '116', 2, 3, 9, NOW(), NOW()),
    (57, '117', 2, 3, 9, NOW(), NOW()), (58, '118', 2, 3, 9, NOW(), NOW()),
    (59, '119', 2, 3, 9, NOW(), NOW()), (60, '120', 2, 3, 9, NOW(), NOW()),

    -- ==========================================================
    -- 4. DS4 Balon (ID: 4) -> IDs 61-80
    -- ==========================================================
    (61, '101', 2, 4, 11, NOW(), NOW()), (62, '102', 2, 4, 11, NOW(), NOW()),
    (63, '103', 2, 4, 11, NOW(), NOW()), (64, '104', 2, 4, 11, NOW(), NOW()),
    (65, '105', 2, 4, 11, NOW(), NOW()), (66, '106', 2, 4, 11, NOW(), NOW()),
    (67, '107', 2, 4, 11, NOW(), NOW()), (68, '108', 2, 4, 11, NOW(), NOW()),
    (69, '109', 2, 4, 11, NOW(), NOW()), (70, '110', 2, 4, 11, NOW(), NOW()),
    (71, '111', 2, 4, 11, NOW(), NOW()), (72, '112', 2, 4, 11, NOW(), NOW()),
    (73, '113', 2, 4, 11, NOW(), NOW()), (74, '114', 2, 4, 11, NOW(), NOW()),
    (75, '115', 2, 4, 11, NOW(), NOW()), (76, '116', 2, 4, 11, NOW(), NOW()),
    (77, '117', 2, 4, 11, NOW(), NOW()), (78, '118', 2, 4, 11, NOW(), NOW()),
    (79, '119', 2, 4, 11, NOW(), NOW()), (80, '120', 2, 4, 11, NOW(), NOW()),

    -- ==========================================================
    -- 5. DS B-1 Bydgoska (ID: 5) -> IDs 81-100
    -- ==========================================================
    (81, '101', 1, 5, 5, NOW(), NOW()), (82, '102', 1, 5, 5, NOW(), NOW()),
    (83, '103', 2, 5, 12, NOW(), NOW()), (84, '104', 2, 5, 12, NOW(), NOW()),
    (85, '105', 2, 5, 12, NOW(), NOW()), (86, '106', 2, 5, 12, NOW(), NOW()),
    (87, '107', 2, 5, 12, NOW(), NOW()), (88, '108', 2, 5, 12, NOW(), NOW()),
    (89, '109', 2, 5, 12, NOW(), NOW()), (90, '110', 2, 5, 12, NOW(), NOW()),
    (91, '111', 2, 5, 12, NOW(), NOW()), (92, '112', 2, 5, 12, NOW(), NOW()),
    (93, '113', 2, 5, 12, NOW(), NOW()), (94, '114', 2, 5, 12, NOW(), NOW()),
    (95, '115', 2, 5, 12, NOW(), NOW()), (96, '116', 2, 5, 12, NOW(), NOW()),
    (97, '117', 2, 5, 12, NOW(), NOW()), (98, '118', 2, 5, 12, NOW(), NOW()),
    (99, '119', 2, 5, 12, NOW(), NOW()), (100, '120', 2, 5, 12, NOW(), NOW());






-- Insert sample reservation resources (laundry, common rooms, etc.)
INSERT INTO reservation_resources (name, building_id, description, is_active, resource_type, created_at, updated_at)
VALUES
    -- Pralnie DS1
    ('Pralnia - 1.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 2.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 3.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 4.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 5.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 6.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 7.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 8.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 9.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 10.piętro', 1, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    -- Pralnie DS2
    ('Pralnia - 1.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 2.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 3.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 4.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 5.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 6.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 7.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 8.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 9.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 10.piętro', 2, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    -- Pralnie DS3
    ('Pralnia - 1.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 2.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 3.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 4.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 5.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 6.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 7.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 8.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 9.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 10.piętro', 3, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    -- Pralnie DS4
    ('Pralnia - 1.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 2.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 3.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 4.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 5.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 6.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 7.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 8.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 9.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 10.piętro', 4, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    -- Pralnie DS Bydgoska
    ('Pralnia - 1.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 2.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 3.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 4.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 5.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 6.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 7.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 8.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 9.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),
    ('Pralnia - 10.piętro', 5, 'Pralka i suszarka', true, 'LAUNDRY', NOW(), NOW()),



    -- Inne DS1
    ('Salka tenisa stołowego DS1', 1, 'Dwa stoły do tenisa stołowego', true, 'STANDARD', NOW(), NOW()),
    ('Salka TV DS1', 1, 'Telewizor, wygodna kanapa i kilka krzeseł', true, 'STANDARD', NOW(), NOW()),
    ('Salka Kujon DS1', 1, 'Salka znajdująca się na parterze, przeznaczona do spokojnej nauki w pojedynkę lub większą grupą.', true, 'STANDARD', NOW(), NOW()),

    -- Inne DS2
    ('Salka tenisa stołowego DS2', 2, 'Dwa stoły do tenisa stołowego', true, 'STANDARD', NOW(), NOW()),
    ('Salka TV DS2', 2, 'Telewizor, wygodna kanapa i kilka krzeseł', true, 'STANDARD', NOW(), NOW()),
    ('Salka Ćwiczeń DS2', 2, 'Worek do boksowania, hantle i wiele więcej', true, 'STANDARD', NOW(), NOW()),

    -- Inne DS3
    ('Salka tenisa stołowego DS3', 3, 'Dwa stoły do tenisa stołowego', true, 'STANDARD', NOW(), NOW()),
    ('Salka TV DS3', 3, 'Telewizor, wygodna kanapa i kilka krzeseł', true, 'STANDARD', NOW(), NOW()),
    ('Sala muzyczna DS3', 3, 'Przestrzeń do grania i ćwiczeń muzycznych. Instrumenty i sprzęt nagłaśniający na miejscu.', true, 'STANDARD', NOW(), NOW()),

    -- Inne DS4
    ('Salka tenisa stołowego DS4', 4, 'Dwa stoły do tenisa stołowego', true, 'STANDARD', NOW(), NOW()),
    ('Salka TV DS4', 4, 'Telewizor, wygodna kanapa i kilka krzeseł', true, 'STANDARD', NOW(), NOW()),
    ('Sala bilardowa DS4', 4, 'Perfekcyjne miejsce na rozgrywki bilardowe. Kije, bile i wszystko czego potrzebujesz do gry.', true, 'STANDARD', NOW(), NOW()),
    ('Sala kinowa DS4', 4, 'Profesjonalna sala kinowa z dużym ekranem i nagłośnieniem.', true, 'STANDARD', NOW(), NOW()),

    -- Inne DS Bydgoska
    ('Sala bilardowa DS Bydgoska', 5, 'Perfekcyjne miejsce na rozgrywki bilardowe. Kije, bile i wszystko czego potrzebujesz do gry.', true, 'STANDARD', NOW(), NOW());


INSERT INTO users (email, password, first_name, last_name, phone, room_id)
VALUES
    -- ==========================================================
    -- CORE USERS (Zachowani)
    -- ==========================================================
    ('admin@admin.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Tomasz', 'Gawin', '689456235', null), -- ID 1
    ('resident@resident.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jakub', 'Sołtykiewicz', '689456235', 1),   -- ID 2
    ('technician@technician.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Karol', 'Nowak', '689456235', null), -- ID 3

    -- ==========================================================
    -- NEW TECHNICIANS (2 dodatkowych)
    -- ==========================================================
    ('marek.srubka@tech.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Marek', 'Śrubka', '601999888', null), -- ID 4
    ('dariusz.kabel@tech.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Dariusz', 'Kabel', '602777666', null), -- ID 5

    -- ==========================================================
    -- RESIDENTS (Dużo mieszkańców - przypisane pokoje od 2 w górę)
    -- ==========================================================
    ('anna.kowalska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Anna', 'Kowalska', '600100100', 2),
    ('piotr.nowak@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Piotr', 'Nowak', '600100101', 3),
    ('julia.mazur@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Julia', 'Mazur', '600100102', 4),
    ('michal.wozniak@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Michał', 'Woźniak', '600100103', 5),
    ('katarzyna.lewandowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Katarzyna', 'Lewandowska', '600100104', 6),
    ('pawel.wisniewski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Paweł', 'Wiśniewski', '600100105', 7),
    ('magdalena.zielinska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Magdalena', 'Zielińska', '600100106', 8),
    ('bartosz.kaczmarek@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Bartosz', 'Kaczmarek', '600100107', 9),
    ('alicja.piotrowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Alicja', 'Piotrowska', '600100108', 10),
    ('jakub.kowalczyk@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jakub', 'Kowalczyk', '600100109', 11),
    ('zofia.kaminska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Zofia', 'Kamińska', '600100110', 12),
    ('szymon.lewandowski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Szymon', 'Lewandowski', '600100111', 13),
    ('maria.dabrowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Maria', 'Dąbrowska', '600100112', 14),
    ('jan.zielinski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jan', 'Zieliński', '600100113', 15),
    ('aleksandra.szymanska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Aleksandra', 'Szymańska', '600100114', 16),
    ('krzysztof.wojtas@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Krzysztof', 'Wojtas', '600100115', 17),
    ('weronika.kozlowska@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Weronika', 'Kozłowska', '600100116', 18),
    ('mateusz.jankowski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Mateusz', 'Jankowski', '600100117', 19),
    ('oliwia.mazurek@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Oliwia', 'Mazurek', '600100118', 20),
    ('filip.krawczyk@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Filip', 'Krawczyk', '600100119', 21),
    ('natalia.piotrowicz@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Natalia', 'Piotrowicz', '600100120', 22),
    ('antoni.grabowski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Antoni', 'Grabowski', '600100121', 23),
    ('wiktor.pawlowski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Wiktor', 'Pawłowski', '600100122', 24),
    ('kacper.michalski@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Kacper', 'Michalski', '600100123', 25),
    ('zuzanna.krol@example.com', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Zuzanna', 'Król', '600100124', 26),
    ('marcin.lis@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Marcin', 'Lis', '690000001', 27),
    ('dorota.kruk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Dorota', 'Kruk', '690000002', 28),
    ('tomasz.zajac@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Tomasz', 'Zając', '690000003', 29),
    ('agnieszka.mroz@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Agnieszka', 'Mróz', '690000004', 30),
    ('rafal.sikora@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Rafał', 'Sikora', '690000005', 31),
    ('monika.wrubel@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Monika', 'Wróbel', '690000006', 32),
    ('lukasz.dudek@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Łukasz', 'Dudek', '690000007', 33),
    ('izabela.malinowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Izabela', 'Malinowska', '690000008', 34),
    ('przemyslaw.pawlak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Przemysław', 'Pawlak', '690000009', 35),
    ('ewelina.witkowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Ewelina', 'Witkowska', '690000010', 36),

    -- Pokoje 37-46
    ('damian.walczak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Damian', 'Walczak', '690000011', 37),
    ('karolina.stepien@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Karolina', 'Stępień', '690000012', 38),
    ('grzegorz.gorski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Grzegorz', 'Górski', '690000013', 39),
    ('marta.rutkowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Marta', 'Rutkowska', '690000014', 40),
    ('artur.michalak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Artur', 'Michalak', '690000015', 41),
    ('patrycja.adamczyk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Patrycja', 'Adamczyk', '690000016', 42),
    ('kamil.sikorski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Kamil', 'Sikorski', '690000017', 43),
    ('natalia.ostrowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Natalia', 'Ostrowska', '690000018', 44),
    ('mateusz.szewczyk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Mateusz', 'Szewczyk', '690000019', 45),
    ('justyna.pietrzak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Justyna', 'Pietrzak', '690000020', 46),

    -- Pokoje 47-56
    ('sebastian.wlodarczyk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Sebastian', 'Włodarczyk', '690000021', 47),
    ('kinga.zalewska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Kinga', 'Zalewska', '690000022', 48),
    ('adrian.kubiak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Adrian', 'Kubiak', '690000023', 49),
    ('aneta.wasilewska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Aneta', 'Wasilewska', '690000024', 50),
    ('dawid.sokolowski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Dawid', 'Sokołowski', '690000025', 51),
    ('paulina.kucharska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Paulina', 'Kucharska', '690000026', 52),
    ('daniel.wroblewski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Daniel', 'Wróblewski', '690000027', 53),
    ('dominika.jasinska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Dominika', 'Jasińska', '690000028', 54),
    ('hubert.marcinkowski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Hubert', 'Marcinkowski', '690000029', 55),
    ('sylwia.sadowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Sylwia', 'Sadowska', '690000030', 56),

    -- Pokoje 57-66
    ('radek.zawadzki@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Radek', 'Zawadzki', '690000031', 57),
    ('kamila.bak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Kamila', 'Bąk', '690000032', 58),
    ('mikolaj.chmielewski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Mikołaj', 'Chmielewski', '690000033', 59),
    ('malgorzata.borkowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Małgorzata', 'Borkowska', '690000034', 60),
    ('patryk.wilk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Patryk', 'Wilk', '690000035', 61),
    ('iwona.kalinowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Iwona', 'Kalinowska', '690000036', 62),
    ('marek.lisowski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Marek', 'Lisowski', '690000037', 63),
    ('angelika.maciejewska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Angelika', 'Maciejewska', '690000038', 64),
    ('arkadiusz.szczepanski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Arkadiusz', 'Szczepański', '690000039', 65),
    ('lidia.kaczor@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Lidia', 'Kaczor', '690000040', 66),

    -- Pokoje 67-76
    ('barbara.sobczak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Barbara', 'Sobczak', '690000041', 67),
    ('tadeusz.konieczny@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Tadeusz', 'Konieczny', '690000042', 68),
    ('grazyna.krupa@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Grażyna', 'Krupa', '690000043', 69),
    ('jerzy.urbanski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jerzy', 'Urbański', '690000044', 70),
    ('krystyna.domanska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Krystyna', 'Domańska', '690000045', 71),
    ('wieslaw.zakrzewski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Wiesław', 'Zakrzewski', '690000046', 72),
    ('renata.laskowska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Renata', 'Laskowska', '690000047', 73),
    ('stanislaw.gajewski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Stanisław', 'Gajewski', '690000048', 74),
    ('elzbieta.marek@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Elżbieta', 'Marek', '690000049', 75),
    ('roman.klos@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Roman', 'Kłos', '690000050', 76),

    -- Pokoje 77-86
    ('beata.bednarek@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Beata', 'Bednarek', '690000051', 77),
    ('jacek.koziol@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jacek', 'Kozioł', '690000052', 78),
    ('joanna.ciesielska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Joanna', 'Ciesielska', '690000053', 79),
    ('andrzej.kowal@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Andrzej', 'Kowal', '690000054', 80),
    ('wioletta.wrobel@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Wioletta', 'Wróbel', '690000055', 81),
    ('mariusz.piorkowski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Mariusz', 'Piórkowski', '690000056', 82),
    ('hanna.matusiak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Hanna', 'Matusiak', '690000057', 83),
    ('dariusz.musial@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Dariusz', 'Musiał', '690000058', 84),
    ('teresa.jarosz@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Teresa', 'Jarosz', '690000059', 85),
    ('adam.nowacki@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Adam', 'Nowacki', '690000060', 86),

    -- Pokoje 87-96
    ('danuta.skowronska@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Danuta', 'Skowrońska', '690000061', 87),
    ('wojciech.krupa@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Wojciech', 'Krupa', '690000062', 88),
    ('alina.domagala@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Alina', 'Domagała', '690000063', 89),
    ('slawomir.kaczmarczyk@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Sławomir', 'Kaczmarczyk', '690000064', 90),
    ('halina.rusin@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Halina', 'Rusin', '690000065', 91),
    ('michal.tomczak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Michał', 'Tomczak', '690000066', 92),
    ('olga.koziol@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Olga', 'Kozioł', '690000067', 93),
    ('zbigniew.kot@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Zbigniew', 'Kot', '690000068', 94),
    ('irena.michalak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Irena', 'Michalak', '690000069', 95),
    ('henryk.wolski@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Henryk', 'Wolski', '690000070', 96),

    -- Pokoje 97-100 (końcówka pierwszych lokatorów)
    ('lucyna.nawrot@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Lucyna', 'Nawrot', '690000071', 97),
    ('leszek.kasprzak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Leszek', 'Kasprzak', '690000072', 98),
    ('jolanta.czarnecka@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Jolanta', 'Czarnecka', '690000073', 99),
    ('krzysztof.gajda@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Krzysztof', 'Gajda', '690000074', 100),

    -- DRUDZY LOKATORZY (Dla pokoi 27-36) - żeby pokoje 2-osobowe były pełne
    ('anna.mucha@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Anna', 'Mucha', '690000075', 27),
    ('piotr.bialek@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Piotr', 'Białek', '690000076', 28),
    ('maria.cieslak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Maria', 'Cieślak', '690000077', 29),
    ('andrzej.skrzypczak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Andrzej', 'Skrzypczak', '690000078', 30),
    ('ewa.gwozdz@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Ewa', 'Gwóźdź', '690000079', 31),
    ('tomasz.kozak@ds.pl', '$2a$12$GuBHXDKgLih2ZGvzD7tQV.RC2BdiiTR6O3ZiP1Z0BILgkBbtQDJHO', 'Tomasz', 'Kozak', '690000080', 32);

INSERT INTO user_roles (user_id, role_name)
VALUES
    (1, 'ROLE_ADMIN'),
    (2, 'ROLE_RESIDENT'),
    -- Technicians (IDs 3, 4, 5)
    (3, 'ROLE_TECHNICIAN'),
    (4, 'ROLE_TECHNICIAN'),
    (5, 'ROLE_TECHNICIAN'),
    -- Residents (IDs 6 to 30)
    (6, 'ROLE_RESIDENT'),
    (7, 'ROLE_RESIDENT'),
    (8, 'ROLE_RESIDENT'),
    (9, 'ROLE_RESIDENT'),
    (10, 'ROLE_RESIDENT'),
    (11, 'ROLE_RESIDENT'),
    (12, 'ROLE_RESIDENT'),
    (13, 'ROLE_RESIDENT'),
    (14, 'ROLE_RESIDENT'),
    (15, 'ROLE_RESIDENT'),
    (16, 'ROLE_RESIDENT'),
    (17, 'ROLE_RESIDENT'),
    (18, 'ROLE_RESIDENT'),
    (19, 'ROLE_RESIDENT'),
    (20, 'ROLE_RESIDENT'),
    (21, 'ROLE_RESIDENT'),
    (22, 'ROLE_RESIDENT'),
    (23, 'ROLE_RESIDENT'),
    (24, 'ROLE_RESIDENT'),
    (25, 'ROLE_RESIDENT'),
    (26, 'ROLE_RESIDENT'),
    (27, 'ROLE_RESIDENT'),
    (28, 'ROLE_RESIDENT'),
    (29, 'ROLE_RESIDENT'),
    (30, 'ROLE_RESIDENT'),
    (31, 'ROLE_RESIDENT'), (32, 'ROLE_RESIDENT'), (33, 'ROLE_RESIDENT'), (34, 'ROLE_RESIDENT'), (35, 'ROLE_RESIDENT'),
    (36, 'ROLE_RESIDENT'), (37, 'ROLE_RESIDENT'), (38, 'ROLE_RESIDENT'), (39, 'ROLE_RESIDENT'), (40, 'ROLE_RESIDENT'),
    (41, 'ROLE_RESIDENT'), (42, 'ROLE_RESIDENT'), (43, 'ROLE_RESIDENT'), (44, 'ROLE_RESIDENT'), (45, 'ROLE_RESIDENT'),
    (46, 'ROLE_RESIDENT'), (47, 'ROLE_RESIDENT'), (48, 'ROLE_RESIDENT'), (49, 'ROLE_RESIDENT'), (50, 'ROLE_RESIDENT'),
    (51, 'ROLE_RESIDENT'), (52, 'ROLE_RESIDENT'), (53, 'ROLE_RESIDENT'), (54, 'ROLE_RESIDENT'), (55, 'ROLE_RESIDENT'),
    (56, 'ROLE_RESIDENT'), (57, 'ROLE_RESIDENT'), (58, 'ROLE_RESIDENT'), (59, 'ROLE_RESIDENT'), (60, 'ROLE_RESIDENT'),
    (61, 'ROLE_RESIDENT'), (62, 'ROLE_RESIDENT'), (63, 'ROLE_RESIDENT'), (64, 'ROLE_RESIDENT'), (65, 'ROLE_RESIDENT'),
    (66, 'ROLE_RESIDENT'), (67, 'ROLE_RESIDENT'), (68, 'ROLE_RESIDENT'), (69, 'ROLE_RESIDENT'), (70, 'ROLE_RESIDENT'),
    (71, 'ROLE_RESIDENT'), (72, 'ROLE_RESIDENT'), (73, 'ROLE_RESIDENT'), (74, 'ROLE_RESIDENT'), (75, 'ROLE_RESIDENT'),
    (76, 'ROLE_RESIDENT'), (77, 'ROLE_RESIDENT'), (78, 'ROLE_RESIDENT'), (79, 'ROLE_RESIDENT'), (80, 'ROLE_RESIDENT'),
    (81, 'ROLE_RESIDENT'), (82, 'ROLE_RESIDENT'), (83, 'ROLE_RESIDENT'), (84, 'ROLE_RESIDENT'), (85, 'ROLE_RESIDENT'),
    (86, 'ROLE_RESIDENT'), (87, 'ROLE_RESIDENT'), (88, 'ROLE_RESIDENT'), (89, 'ROLE_RESIDENT'), (90, 'ROLE_RESIDENT'),
    (91, 'ROLE_RESIDENT'), (92, 'ROLE_RESIDENT'), (93, 'ROLE_RESIDENT'), (94, 'ROLE_RESIDENT'), (95, 'ROLE_RESIDENT'),
    (96, 'ROLE_RESIDENT'), (97, 'ROLE_RESIDENT'), (98, 'ROLE_RESIDENT'), (99, 'ROLE_RESIDENT'), (100, 'ROLE_RESIDENT'),
    (101, 'ROLE_RESIDENT'), (102, 'ROLE_RESIDENT'), (103, 'ROLE_RESIDENT'), (104, 'ROLE_RESIDENT'), (105, 'ROLE_RESIDENT'),
    (106, 'ROLE_RESIDENT'), (107, 'ROLE_RESIDENT'), (108, 'ROLE_RESIDENT'), (109, 'ROLE_RESIDENT'), (110, 'ROLE_RESIDENT');

-- Insert sample announcements
INSERT INTO announcements (title, content, category, start_date, end_date, created_at, updated_at)
VALUES
    ('Przerwa w dostawie wody - Budynek DS1 Rumcajs', 'W sobotę 06.12.2025 w godzinach 8:00 - 14:00 w Budynku DS1 Rumcajs nastąpi przerwa w dostawie wody z powodu prac konserwacyjnych. Prosimy o przygotowanie zapasów.', 'WATER', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', NOW(), NOW()),
    ('Modernizacja internetu w tym tygodniu', 'Modernizujemy infrastrukturę internetową. Mogą wystąpić krótkie przerwy w dostępie do sieci poza godzinami szczytu.', 'INTERNET', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', NOW(), NOW()),
    ('Planowane wyłączenie prądu - Budynek DS2 Leon', 'W niedzielę 07.12.2025 w godzinach 6:00 - 10:00 w budynku DS2 Leon nastąpi planowana przerwa w dostawie prądu w celu inspekcji instalacji.', 'ELECTRICITY', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', NOW(), NOW()),
    ('Konserwacja windy', 'Winda w Budynku DS3 Bartek będzie wyłączona z użytku od poniedziałku do środy z powodu prac serwisowych. Prosimy o korzystanie ze schodów.', 'MAINTENANCE', CURRENT_DATE, CURRENT_DATE + INTERVAL '10 days', NOW(), NOW()),
    ('Spotkanie mieszkańców w przyszłym tygodniu', 'Zapraszamy na comiesięczne spotkanie mieszkańców w czwartek 11.12.2025 o 19:00 w Salce TV DS1 Rumcajs. Będzie pizza!', 'GENERAL', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', NOW(), NOW()),
    ('Przegląd ogrzewania', 'W przyszłym miesiącu odbędzie się coroczny przegląd instalacji grzewczej. Nie przewidujemy przerw w dostawie ciepła.', 'MAINTENANCE', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '30 days', NOW(), NOW());

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
