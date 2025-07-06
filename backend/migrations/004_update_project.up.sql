ALTER TABLE Project DROP FOREIGN KEY Project_ibfk_2;
ALTER TABLE Project
DROP COLUMN project_type_id;

ALTER TABLE Technology DROP FOREIGN KEY Technology_ibfk_1;
ALTER TABLE Technology
DROP COLUMN category_id;  

DROP TABLE ProjectType;

CREATE TABLE Types (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE ProjectType (
    id int PRIMARY KEY AUTO_INCREMENT,
    project_id int, 
    type_id int
);

ALTER TABLE ProjectType ADD FOREIGN KEY (project_id) REFERENCES Project (id);
ALTER TABLE ProjectType ADD FOREIGN KEY (type_id) REFERENCES Types (id);
