ALTER TABLE User
  DROP COLUMN google_id,
  DROP COLUMN name,
  DROP COLUMN updated_at,
  ADD COLUMN date_of_birth DATE,
  ADD COLUMN last_name VARCHAR(255),
  ADD COLUMN first_name VARCHAR(255),
  ADD COLUMN username VARCHAR(255);