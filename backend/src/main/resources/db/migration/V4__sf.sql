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
	('Rüstungsgewöhnung I', 100, 2),
	('Schildkampf I', 100, 2),
	('Schildkampf II', 100, 2),
	('Stabzauber: Bindung', 100, 1),
	('Ausweichen I', 100, 2),
	('Standfest', 100, 0),
	('Auspendeln', 100, 2),
	('Block', 100, 2),
	('Doppelschlag', 100, 2),
	('Eisenarm', 100, 2),
	('Gerade', 100, 2),
	('Handkante', 100, 2),
	('Kreuzblock', 100, 2),
	('Meereskundig', 100, 0),
	('Schmetterschlag', 100, 2),
	('Schwinger', 100, 2),
	('Waffenloser Kampfstil: Hammerfaust', 100, 2),
	('Wuchtschlag', 100, 2),
	('Tanz der Mada', 100, 0);
	
	
	
