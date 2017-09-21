create table kampf(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	json text NOT NULL
);

create table gegner(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	json text NOT NULL
);

INSERT INTO KAMPF VALUES(0, 'Testkampf', '[{"name":"Testname","iniBase":12,"maxLep":31, "currentLep":31, "pa":12,"ausweichen":12,"ruestung":3,"attacken":[{"name":"Schwert","at":12,"schaden":{"fix":3,"w6":1}}]}]')