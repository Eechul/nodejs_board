-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- 생성 시간: 16-11-07 01:26
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
-- 테이블 구조 `board_like_tb`
--

CREATE TABLE `board_like_tb` (
  `BOARD_LIKE_NO` int(11) NOT NULL,
  `BOARD_NO` int(11) NOT NULL,
  `USER_CD` varchar(20) DEFAULT NULL,
  `LIKE_FL` char(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `board_like_tb`
--
ALTER TABLE `board_like_tb`
  ADD PRIMARY KEY (`BOARD_LIKE_NO`,`BOARD_NO`),
  ADD KEY `BOARD_NO` (`BOARD_NO`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `board_like_tb`
--
ALTER TABLE `board_like_tb`
  MODIFY `BOARD_LIKE_NO` int(11) NOT NULL AUTO_INCREMENT;
--
-- 덤프된 테이블의 제약사항
--

--
-- 테이블의 제약사항 `board_like_tb`
--
ALTER TABLE `board_like_tb`
  ADD CONSTRAINT `board_like_tb_ibfk_1` FOREIGN KEY (`BOARD_NO`) REFERENCES `board_tb` (`BOARD_NO`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
