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

INSERT INTO KAMPF VALUES(0, 'Testkampf', '[{"name":"Goblin","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":3,"attacken":[{"name":"Langschwert","at":12,"schaden":{"fix":5,"w6":1}}]},{"name":"Wache","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":4,"attacken":[{"name":"Langschwert","at":10,"schaden":{"fix":5,"w6":1}}]}]');


INSERT INTO GEGNER VALUES(0, 'Goblin', '{"name":"Goblin","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":3,"attacken":[{"name":"Laxngschwert","at":12,"schaden":{"fix":5,"w6":1}}]}');
INSERT INTO GEGNER VALUES(1, 'Stadtwache', '{"name":"Wache","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":4,"attacken":[{"name":"Langschwert","at":10,"schaden":{"fix":5,"w6":1}}]}');
