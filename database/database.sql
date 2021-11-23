CREATE database `wos`;

CREATE TABLE `slack_users` (
  `id` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `real_name` varchar(300) NOT NULL,
  `tz` varchar(100) DEFAULT NULL,
  `status_text` varchar(200) DEFAULT NULL,
  `status_emoji` varchar(100) DEFAULT NULL,
  `image_512` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;