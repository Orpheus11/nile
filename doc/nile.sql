DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `modification_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  `user_name` varchar(64) DEFAULT NULL,
  `task_id` int(11) NOT NULL,
  `task_desc` varchar(255) NOT NULL,
  `slb` varchar(64) DEFAULT NULL,
  `slb_ports` varchar(255) DEFAULT NULL,
  `autorollback` tinyint(1) DEFAULT NULL,
  `app_manager` varchar(32) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `applications_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `machines`;
CREATE TABLE `machines` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `domain` varchar(36) NOT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `env` varchar(15) NOT NULL,
  `status` varchar(64) NOT NULL,
  `zone` varchar(15) NOT NULL,
  `user_name` varchar(64) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `machines_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `modifications`;
CREATE TABLE `modifications` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `app_id` varchar(36) NOT NULL,
  `code_base` varchar(255) DEFAULT NULL,
  `code_url` varchar(255) NOT NULL,
  `code_version` varchar(255) NOT NULL,
  `version` varchar(64) NOT NULL,
  `auto` tinyint(1) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `modifications_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `service_machine`;
CREATE TABLE `service_machine` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `app_id` varchar(36) NOT NULL,
  `machine_id` varchar(36) DEFAULT NULL,
  `batch` int(11) NOT NULL,
  `status` varchar(64) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `service_machine_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `processes`;
CREATE TABLE `processes` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `app_id` varchar(36) NOT NULL,
  `app_name` varchar(255) NOT NULL,
  `task` varchar(255) DEFAULT NULL,
  `status` varchar(64) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `processes_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `op_logs`;
CREATE TABLE `op_logs` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `app_id` varchar(36) NOT NULL,
  `app_name` varchar(255) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `status` varchar(64) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `user_name` varchar(64) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `op_logs_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
