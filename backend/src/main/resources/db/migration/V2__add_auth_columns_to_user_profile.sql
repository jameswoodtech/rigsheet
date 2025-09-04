-- Add auth columns to user_profile if missing (Postgres)
ALTER TABLE user_profile
  ADD COLUMN IF NOT EXISTS password_hash varchar(255);

ALTER TABLE user_profile
  ADD COLUMN IF NOT EXISTS roles varchar(255);