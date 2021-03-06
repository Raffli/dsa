create table kampf(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	json text NOT NULL,
	PRIMARY KEY(id)
);

create table gegner(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	json text NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO kampf VALUES(1, 'Testkampf', '[{"name":"Goblin","iniBase":12,"maxLep":30,"ws":6,"pa":10,"ausweichen":10,"ruestung":3,"attacken":[{"name":"Langschwert","at":12,"schaden":{"fix":5,"w6":1}}],"currentLep":30},{"name":"Wache","iniBase":12,"maxLep":30,"ws":6,"pa":10,"ausweichen":10,"ruestung":4,"attacken":[{"name":"Langschwert","at":10,"schaden":{"fix":5,"w6":1}}],"currentLep":30}]');


INSERT INTO gegner VALUES(1, 'Goblin', '{"wunden":0,"name":"Goblin","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":3,"attacken":[{"name":"Langschwert","at":12,"schaden":{"fix":5,"w6":1}}]}');
INSERT INTO gegner VALUES(2, 'Stadtwache', '{"wunden":0,"name":"Wache","iniBase":12,"maxLep":30,"pa":10,"ausweichen":10,"ruestung":4,"attacken":[{"name":"Langschwert","at":10,"schaden":{"fix":5,"w6":1}}]}');
