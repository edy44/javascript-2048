DROP DATABASE IF EXISTS jquery_rush;
CREATE DATABASE jquery_rush;
USE jquery_rush;

CREATE TABLE IF NOT EXISTS `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `turn` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `array` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
