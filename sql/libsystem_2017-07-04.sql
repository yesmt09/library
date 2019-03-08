# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: db1.office.babeltime-inc.com (MySQL 5.1.59-log)
# Database: libsystem
# Generation Time: 2017-07-04 01:23:53 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table book
# ------------------------------------------------------------

CREATE TABLE `book` (
  `isbn` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) COLLATE utf8_bin NOT NULL,
  `author` varchar(50) COLLATE utf8_bin NOT NULL,
  `type` varchar(10) COLLATE utf8_bin NOT NULL,
  `press` varchar(50) COLLATE utf8_bin NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `content` text COLLATE utf8_bin NOT NULL,
  `catalog` text COLLATE utf8_bin NOT NULL,
  `callNumber` varchar(20) COLLATE utf8_bin NOT NULL,
  `address` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`isbn`),
  KEY `title` (`title`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



# Dump of table borrow
# ------------------------------------------------------------

CREATE TABLE `borrow` (
  `readerId` varchar(10) COLLATE utf8_bin NOT NULL,
  `isbn` int(10) unsigned NOT NULL,
  `barcode` char(8) COLLATE utf8_bin NOT NULL,
  `outDate` datetime NOT NULL,
  `frequency` int(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



# Dump of table history
# ------------------------------------------------------------

CREATE TABLE `history` (
  `readerId` varchar(10) COLLATE utf8_bin NOT NULL,
  `isbn` int(10) unsigned NOT NULL,
  `outDate` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '0',
  `inDate` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`readerId`,`isbn`,`outDate`,`inDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



# Dump of table isbn_barcode
# ------------------------------------------------------------

CREATE TABLE `isbn_barcode` (
  `isbn` int(10) unsigned NOT NULL,
  `barcode` char(8) COLLATE utf8_bin NOT NULL,
  `state` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



# Dump of table order
# ------------------------------------------------------------

CREATE TABLE `order` (
  `readerId` varchar(10) COLLATE utf8_bin NOT NULL,
  `isbn` int(10) unsigned NOT NULL,
  `orderDate` datetime NOT NULL,
  `inDate` datetime NOT NULL,
  `state` tinyint(4) NOT NULL,
  PRIMARY KEY (`readerId`,`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



# Dump of table reader
# ------------------------------------------------------------

CREATE TABLE `reader` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `readerId` varchar(10) COLLATE utf8_bin NOT NULL,
  `password` varchar(200) COLLATE utf8_bin NOT NULL,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `sex` char(1) COLLATE utf8_bin NOT NULL,
  `phone` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `email` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `maxBorrow` tinyint(4) NOT NULL,
  `maxOrder` tinyint(4) NOT NULL,
  `creditNum` varchar(18) COLLATE utf8_bin NOT NULL DEFAULT '',
  `type` varchar(10) COLLATE utf8_bin NOT NULL DEFAULT '',
  `job` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT '',
  `breakRule` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `readerId` (`readerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
