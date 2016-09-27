CREATE TABLE USER_TB (
	USER_CD varchar(20) NOT NULL,  /* ������ڵ� */
	EMAIL_NM varchar(40) NOT NULL,  /* �̸��� */
	NICKNAME_NM varchar(50) NOT NULL, /* �г��� */

    PRIMARY KEY (USER_CD)
)

drop table USER_TB

ALTER TABLE USER_TB
	ADD
		CONSTRAINT PK_USER_TB
		PRIMARY KEY NONCLUSTERED (
			USER_CD ASC
		)


/* �Խ��� */
CREATE TABLE BOARD_TB (
	BOARD_NO int NOT NULL AUTO_INCREMENT,  /* �Խ��ǹ�ȣ */
	USER_CD varchar(20),  /* ������ڵ� */
	TITLE_NM varchar(200),  /* ���� */
	HIT_CNT int DEFAULT 0,  /* ��ȸ�� */
	LIKE_CNT int DEFAULT 0, /* ��õ�� */

    PRIMARY KEY (BOARD_NO),
    FOREIGN KEY (USER_CD) REFERENCES USER_TB(USER_CD)
)

drop table BOARD_TB

ALTER

/* �Խ���_��õ */
CREATE TABLE BOARD_LIKE_TB (
	BOARD_LIKE_NO int NOT NULL AUTO_INCREMENT,  /* ��õ��ȣ */
	BOARD_NO int NOT NULL,  /* �Խ��ǹ�ȣ */
	USER_CD varchar(20),  /* ������ڵ� */
	LIKE_FL char(1) DEFAULT "1", /* ��õ���� */

    PRIMARY KEY (BOARD_LIKE_NO, BOARD_NO),
    FOREIGN KEY (BOARD_NO) REFERENCES BOARD_TB(BOARD_NO) ON DELETE CASCADE
)
drop table BOARD_LIKE_TB


/* �Խ���_��õ �⺻Ű */
ALTER TABLE BOARD_LIKE_TB
	ADD
		CONSTRAINT PK_BOARD_LIKE_TB
		PRIMARY KEY NONCLUSTERED (
			BOARD_LIKE_NO ASC,
			BOARD_NO ASC
		)


INSERT user_tb(user_cd, email_nm, nickname_nm) VALUES (CONCAT(DATE_FORMAT(now(), '%y%m%d%k%i'),SUBSTR(MD5(RAND()),1,4)),
														"choise154@gmail.com", "����")


                                                        INSERT user_tb(user_cd, email_nm, nickname_nm) VALUES (CONCAT(DATE_FORMAT(now(), '%y%m%d%k%i'),SUBSTR(MD5(RAND()),1,4)),
														"choise154@naver.com", "ö��")



 user_tb

/*board_tb ���� Į�� ���� */

 INSERT board_tb(user_cd, title_nm) VALUES ('1609271400011f', "�� ¯")


/*���ƿ� Ŭ������ sql*/
select *
from BOARD_LIKE_TB
where board_no = ?
	and user_cd = ?

�����ϴ� row ����? => insert BOARD_LIKE_TB(board_no, user_no) values(?, ?); [ like_fl �⺻�� '1' (��õ ����)]
�����ϴ� row �ִ�?(�ٽô����ٴ°� ��Ҹ� ����) => update board_tb set like_fl = 0 where board_no = ? and user_cd = ?
�����ϴ� row�����鼭 fl�� 0�̸� => update board_tb set like_fl = 1 where board_no = ? and user_cd = ?
�����ϴ�..! Ʈ������ �����ؾ���. ���� ���ϰ�