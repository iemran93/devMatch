CREATE TABLE ProjectRequest (
    id int PRIMARY KEY AUTO_INCREMENT,
    project_id int NOT NULL,
    user_id int NOT NULL,
    role_id int NOT NULL,
    status ENUM(
        'pending',
        'accepted',
        'rejected'
    ) NOT NULL DEFAULT 'pending',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projectrequest_role FOREIGN KEY (role_id) REFERENCES ProjectRole (id),
    CONSTRAINT fk_projectrequest_project FOREIGN KEY (project_id) REFERENCES Project (id),
    CONSTRAINT fk_projectrequest_user FOREIGN KEY (user_id) REFERENCES User (id)
);