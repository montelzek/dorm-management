CREATE TABLE user_roles
(
    user_id   INTEGER     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role_name)
);