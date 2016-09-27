CREATE TABLE USER_TB (
	USER_CD varchar(20) NOT NULL,  /* 사용자코드 */
	EMAIL_NM varchar(40) NOT NULL,  /* 이메일 */
	NICKNAME_NM varchar(50) NOT NULL, /* 닉네임 */

    PRIMARY KEY (USER_CD)
)

drop table USER_TB

ALTER TABLE USER_TB
	ADD
		CONSTRAINT PK_USER_TB
		PRIMARY KEY NONCLUSTERED (
			USER_CD ASC
		)


/* 게시판 */
CREATE TABLE BOARD_TB (
	BOARD_NO int NOT NULL AUTO_INCREMENT,  /* 게시판번호 */
	USER_CD varchar(20),  /* 사용자코드 */
	TITLE_NM varchar(200),  /* 제목 */
	HIT_CNT int DEFAULT 0,  /* 조회수 */
	LIKE_CNT int DEFAULT 0, /* 추천수 */

    PRIMARY KEY (BOARD_NO),
    FOREIGN KEY (USER_CD) REFERENCES USER_TB(USER_CD)
)

drop table BOARD_TB

ALTER

/* 게시판_추천 */
CREATE TABLE BOARD_LIKE_TB (
	BOARD_LIKE_NO int NOT NULL AUTO_INCREMENT,  /* 추천번호 */
	BOARD_NO int NOT NULL,  /* 게시판번호 */
	USER_CD varchar(20),  /* 사용자코드 */
	LIKE_FL char(1) DEFAULT "1", /* 추천상태 */

    PRIMARY KEY (BOARD_LIKE_NO, BOARD_NO),
    FOREIGN KEY (BOARD_NO) REFERENCES BOARD_TB(BOARD_NO) ON DELETE CASCADE
)
drop table BOARD_LIKE_TB


/* 게시판_추천 기본키 */
ALTER TABLE BOARD_LIKE_TB
	ADD
		CONSTRAINT PK_BOARD_LIKE_TB
		PRIMARY KEY NONCLUSTERED (
			BOARD_LIKE_NO ASC,
			BOARD_NO ASC
		)


INSERT user_tb(user_cd, email_nm, nickname_nm) VALUES (CONCAT(DATE_FORMAT(now(), '%y%m%d%k%i'),SUBSTR(MD5(RAND()),1,4)),
														"choise154@gmail.com", "동이")


                                                        INSERT user_tb(user_cd, email_nm, nickname_nm) VALUES (CONCAT(DATE_FORMAT(now(), '%y%m%d%k%i'),SUBSTR(MD5(RAND()),1,4)),
														"choise154@naver.com", "철이")



 user_tb

/*board_tb 내용 칼럼 없음 */

 INSERT board_tb(user_cd, title_nm) VALUES ('1609271400011f', "난 짱")


/*좋아요 클릭과정 sql*/
select *
from BOARD_LIKE_TB
where board_no = ?
	and user_cd = ?

존재하는 row 없다? => insert BOARD_LIKE_TB(board_no, user_no) values(?, ?); [ like_fl 기본값 '1' (추천 상태)]
존재하는 row 있다?(다시눌럿다는건 취소를 말함) => update board_tb set like_fl = 0 where board_no = ? and user_cd = ?
존재하는 row있으면서 fl값 0이면 => update board_tb set like_fl = 1 where board_no = ? and user_cd = ?
간단하다..! 트랜젝션 적용해야함. 같이 변하게