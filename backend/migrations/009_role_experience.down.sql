SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS UserSkill;
DROP TABLE IF EXISTS ProjectLanguage;
DROP TABLE IF EXISTS ProjectTechnology;
DROP TABLE IF EXISTS ProjectType;
DROP TABLE IF EXISTS Technology;
DROP TABLE IF EXISTS Language;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Category;

SET FOREIGN_KEY_CHECKS = 1;


ALTER TABLE Project DROP FOREIGN KEY Project_ibfk_1;


DROP TABLE IF EXISTS UserSkill;
DROP TABLE IF EXISTS ProjectLanguage;
DROP TABLE IF EXISTS ProjectTechnology;
DROP TABLE IF EXISTS ProjectType;
DROP TABLE IF EXISTS Technology;
DROP TABLE IF EXISTS Language;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Category;


ALTER TABLE Project
DROP COLUMN category_id,
ADD COLUMN category ENUM('Personal', 'Hackathon', 'Team') NOT NULL;


CREATE TABLE SkillCategory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Skill (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES SkillCategory(id),
    UNIQUE KEY unique_skill_per_category (category_id, name)
);


CREATE TABLE UserSkill (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level INT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skill(id),
    UNIQUE KEY unique_user_skill (user_id, skill_id)
);


CREATE TABLE ProjectSkill (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skill(id),
    UNIQUE KEY unique_project_skill (project_id, skill_id)
);


INSERT INTO SkillCategory (name, description) VALUES 
('language', 'Programming and scripting languages'),
('technology', 'Frameworks, libraries, tools, and platforms'),
('specialization', 'Development domains and specializations');
