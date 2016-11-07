-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- 생성 시간: 16-11-07 01:24
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
-- 테이블 구조 `board_comment_tb`
--

CREATE TABLE `board_comment_tb` (
  `BOARD_COMMENT_NO` int(11) NOT NULL,
  `COMMENT_PASSWORD_TX` varchar(20) NOT NULL,
  `BOARD_NO` int(11) NOT NULL,
  `USER_CD` varchar(20) NOT NULL,
  `COMMENT_TX` text NOT NULL,
  `DEPT_NO` int(4) NOT NULL DEFAULT '0',
  `COMMENT_SORT_NO` int(4) NOT NULL DEFAULT '0',
  `DATE` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `board_comment_tb`
--

INSERT INTO `board_comment_tb` (`BOARD_COMMENT_NO`, `COMMENT_PASSWORD_TX`, `BOARD_NO`, `USER_CD`, `COMMENT_TX`, `DEPT_NO`, `COMMENT_SORT_NO`, `DATE`) VALUES
(2, '43', 18, '123', '123', 0, 0, '2016-11-07 18:04:26'),
(3, '654', 18, '123', '654', 0, 0, '2016-11-07 18:16:04'),
(4, '654', 18, '123', '12375', 0, 0, '2016-11-07 18:17:54'),
(5, '321', 18, '123', '5454', 0, 0, '2016-11-07 18:20:33'),
(6, '543', 18, '54354', '54364373', 0, 0, '2016-11-07 18:20:46'),
(7, '54', 18, '123', '32131241', 0, 0, '2016-11-07 18:21:39'),
(8, 'dddddd', 18, 'ssss', 'gggg', 0, 0, '2016-11-07 18:22:54');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `board_comment_tb`
--
ALTER TABLE `board_comment_tb`
  ADD PRIMARY KEY (`BOARD_COMMENT_NO`),
  ADD KEY `board_comment_FK` (`BOARD_NO`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `board_comment_tb`
--
ALTER TABLE `board_comment_tb`
  MODIFY `BOARD_COMMENT_NO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- 덤프된 테이블의 제약사항
--

--
-- 테이블의 제약사항 `board_comment_tb`
--
ALTER TABLE `board_comment_tb`
  ADD CONSTRAINT `board_comment_FK` FOREIGN KEY (`BOARD_NO`) REFERENCES `board_tb` (`BOARD_NO`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
