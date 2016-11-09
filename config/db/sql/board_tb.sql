-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- 생성 시간: 16-11-09 00:58
-- 서버 버전: 5.6.33
-- PHP 버전: 5.6.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `mysql`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `board_tb`
--

CREATE TABLE `board_tb` (
  `BOARD_NO` int(11) NOT NULL,
  `USER_CD` varchar(20) DEFAULT NULL,
  `TITLE_NM` varchar(200) DEFAULT NULL,
  `HIT_CNT` int(11) DEFAULT '0',
  `LIKE_CNT` int(11) DEFAULT '0',
  `CONTENT_TX` varchar(255) DEFAULT NULL,
  `DATE_DT` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `board_tb`
--

INSERT INTO `board_tb` (`BOARD_NO`, `USER_CD`, `TITLE_NM`, `HIT_CNT`, `LIKE_CNT`, `CONTENT_TX`, `DATE_DT`) VALUES
(18, '동철', '1', 125, 3, '이당', '2016-11-07 15:05:43'),
(20, '리', 'test2', 51, 0, '동철', '2016-11-08 15:25:58'),
(25, '23', 'test', 0, 0, '1414', '2016-11-09 14:03:34'),
(26, '5', 't', 0, 0, '6', '2016-11-09 14:03:40'),
(27, '8', '78', 1, 0, '86', '2016-11-09 14:03:44'),
(28, '5', '0987654321', 1, 0, '35151', '2016-11-09 14:03:50');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `board_tb`
--
ALTER TABLE `board_tb`
  ADD PRIMARY KEY (`BOARD_NO`),
  ADD KEY `USER_CD` (`USER_CD`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `board_tb`
--
ALTER TABLE `board_tb`
  MODIFY `BOARD_NO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
