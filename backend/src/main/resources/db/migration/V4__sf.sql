create table sonderfertigkeiten(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	kosten SMALLINT NOT NULL,
	typ SMALLINT NOT NULL
);


/*profan, magisch, kampf, talentSpezialisierung, zauberSpezialisierung, andereSpezialisierung */
INSERT INTO SONDERFERTIGKEITEN (name, kosten, typ) VALUES
	('Kraftlinienmagie I', 100, 1),
	('Meister der Improvisation', 100, 0),
	('Linkhand', 100, 2),
	('Astrale Meditation', 100, 1),
	('Große Meditation', 100, 1),
	('Merkmalskenntnis: Hellsicht', 100, 1),
	('Merkmalskenntnis: Metamagie', 100, 2),
	('Repräsentation: Magier', 100, 1),
	('Ritualkenntnis: Gildenmagie', 100, 1),
	('Rüstungsgewöhnung II', 100, 2),
	('Stabzauber: Bindung', 100, 1);
	
	
