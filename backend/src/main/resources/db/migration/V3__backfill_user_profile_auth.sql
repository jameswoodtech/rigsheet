-- Set a default role for any users missing roles
UPDATE user_profile
SET roles = 'ROLE_USER'
WHERE roles IS NULL OR roles = '';

-- Set a temporary BCrypted password for users missing a password_hash.
-- Replace the hash below with the one you generated for your chosen temp password.
UPDATE user_profile
SET password_hash = '$2a$10$FtLa3pjE.Mcne5cgZw3d5.zNypg3ApblGj9HiBSBQK.Td9nWAmvkS'
WHERE password_hash IS NULL OR password_hash = '';