ALTER TABLE ProjectType DROP FOREIGN KEY `ProjectType_ibfk_1`;

DROP TABLE ProjectType;
DROP TABLE Types;

CREATE TABLE ProjectType (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) NOT NULL
);

ALTER TABLE Project
ADD COLUMN project_type_id int;

ALTER TABLE Technology
ADD COLUMN category_id int;

