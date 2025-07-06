CREATE TABLE IF NOT EXISTS `User` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `profile_picture` text,
  `date_of_birth` date NOT NULL,
  `availability` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `username_unique` (`username`),
  UNIQUE KEY `email_unique` (`email`)
);

CREATE TABLE IF NOT EXISTS `UserSkill` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `category_id` int,
  `technology_id` int,
  `language_id` int,
  `proficiency_level` varchar(50)
);

CREATE TABLE IF NOT EXISTS `Category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE KEY `name_unique` (`name`)
);

CREATE TABLE IF NOT EXISTS `Technology` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int,
  UNIQUE KEY `name_unique` (`name`)
);

CREATE TABLE IF NOT EXISTS `Language` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE KEY `name_unique` (`name`)
);

CREATE TABLE IF NOT EXISTS `ProjectType` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE KEY `name_unique` (`name`)
);

CREATE TABLE IF NOT EXISTS `Project` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `goals` text,
  `category_id` int,
  `project_type_id` int,
  `stage` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `creator_id` int
);

CREATE TABLE IF NOT EXISTS `ProjectTechnology` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `project_id` int,
  `technology_id` int
);

CREATE TABLE IF NOT EXISTS `ProjectLanguage` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `project_id` int,
  `language_id` int
);

CREATE TABLE IF NOT EXISTS `ProjectRole` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `project_id` int,
  `title` varchar(255) NOT NULL,
  `description` text,
  `required_experience_level` varchar(50),
  `is_filled` boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS `ProjectMember` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `project_id` int,
  `user_id` int,
  `role_id` int,
  `status` varchar(50) NOT NULL,
  `joined_at` timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS `Chat` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `is_project_chat` boolean NOT NULL,
  `project_id` int,
  `created_at` timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS `ChatMember` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `chat_id` int,
  `user_id` int
);

CREATE TABLE IF NOT EXISTS `Message` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `chat_id` int,
  `sender_id` int,
  `content` text NOT NULL,
  `sent_at` timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS `Notification` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `actor_id` int,
  `project_id` int,
  `type` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `is_read` boolean DEFAULT false,
  `created_at` timestamp NOT NULL
);

ALTER TABLE `UserSkill` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `UserSkill` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);
ALTER TABLE `UserSkill` ADD FOREIGN KEY (`technology_id`) REFERENCES `Technology` (`id`);
ALTER TABLE `UserSkill` ADD FOREIGN KEY (`language_id`) REFERENCES `Language` (`id`);
ALTER TABLE `Technology` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);
ALTER TABLE `Project` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);
ALTER TABLE `Project` ADD FOREIGN KEY (`project_type_id`) REFERENCES `ProjectType` (`id`);
ALTER TABLE `Project` ADD FOREIGN KEY (`creator_id`) REFERENCES `User` (`id`);
ALTER TABLE `ProjectTechnology` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
ALTER TABLE `ProjectTechnology` ADD FOREIGN KEY (`technology_id`) REFERENCES `Technology` (`id`);
ALTER TABLE `ProjectLanguage` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
ALTER TABLE `ProjectLanguage` ADD FOREIGN KEY (`language_id`) REFERENCES `Language` (`id`);
ALTER TABLE `ProjectRole` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
ALTER TABLE `ProjectMember` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
ALTER TABLE `ProjectMember` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `ProjectMember` ADD FOREIGN KEY (`role_id`) REFERENCES `ProjectRole` (`id`);
ALTER TABLE `Chat` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
ALTER TABLE `ChatMember` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chat` (`id`);
ALTER TABLE `ChatMember` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `Message` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chat` (`id`);
ALTER TABLE `Message` ADD FOREIGN KEY (`sender_id`) REFERENCES `User` (`id`);
ALTER TABLE `Notification` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `Notification` ADD FOREIGN KEY (`actor_id`) REFERENCES `User` (`id`);
ALTER TABLE `Notification` ADD FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
