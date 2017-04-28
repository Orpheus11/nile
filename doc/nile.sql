DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `pkid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(36) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `task_id` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`pkid`),
  UNIQUE KEY `idx_id` (`id`(10)),
  KEY `applications_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
