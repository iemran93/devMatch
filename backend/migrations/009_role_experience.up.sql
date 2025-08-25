ALTER TABLE ProjectRole 
MODIFY COLUMN required_experience_level INT NOT NULL CHECK (required_experience_level BETWEEN 1 AND 5);
