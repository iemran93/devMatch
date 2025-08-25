SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS ProjectSkill;
DROP TABLE IF EXISTS UserSkill;
DROP TABLE IF EXISTS Skill;
DROP TABLE IF EXISTS SkillCategory;


SET FOREIGN_KEY_CHECKS = 1;


ALTER TABLE Project
DROP COLUMN category,
ADD COLUMN category_id INT;


CREATE TABLE Category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY name_unique (name)
);

CREATE TABLE Technology (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    UNIQUE KEY name_unique (name)
);

CREATE TABLE Language (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY name_unique (name)
);

CREATE TABLE Types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE ProjectType (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT, 
    type_id INT
);

CREATE TABLE UserSkill (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type_id INT,
    technology_id INT,
    language_id INT,
    proficiency_level VARCHAR(50)
);

CREATE TABLE ProjectTechnology (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    technology_id INT
);

CREATE TABLE ProjectLanguage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    language_id INT
);


ALTER TABLE Technology ADD FOREIGN KEY (category_id) REFERENCES Category(id);
ALTER TABLE Project ADD CONSTRAINT Project_ibfk_1 FOREIGN KEY (category_id) REFERENCES Category(id);
ALTER TABLE ProjectType ADD FOREIGN KEY (project_id) REFERENCES Project(id);
ALTER TABLE ProjectType ADD FOREIGN KEY (type_id) REFERENCES Types(id);
ALTER TABLE UserSkill ADD FOREIGN KEY (user_id) REFERENCES User(id);
ALTER TABLE UserSkill ADD FOREIGN KEY (type_id) REFERENCES Types(id);
ALTER TABLE UserSkill ADD FOREIGN KEY (technology_id) REFERENCES Technology(id);
ALTER TABLE UserSkill ADD FOREIGN KEY (language_id) REFERENCES Language(id);
ALTER TABLE ProjectTechnology ADD FOREIGN KEY (project_id) REFERENCES Project(id);
ALTER TABLE ProjectTechnology ADD FOREIGN KEY (technology_id) REFERENCES Technology(id);
ALTER TABLE ProjectLanguage ADD FOREIGN KEY (project_id) REFERENCES Project(id);
ALTER TABLE ProjectLanguage ADD FOREIGN KEY (language_id) REFERENCES Language(id);
