create table sonderfertigkeiten(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	kosten SMALLINT NOT NULL,
	typ SMALLINT NOT NULL,
	PRIMARY KEY(id)
);

/*profan, magisch, kampf, klerikal */

INSERT INTO sonderfertigkeiten (name, kosten, typ) VALUES
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
	('Beidhändiger Kampf I', 100, 2),
	('Beidhändiger Kampf II', 100, 2),
	('Fernzauberei', 100, 1),
	('Regeneration I', 100, 1),
	('Merkmalskenntnis: Umwelt', 100, 1),
	('Stabzauber: Fackel', 100, 1),
	('Merkmalskenntnis: Elementar (Luft)', 100, 1),
	('Aufmerksamkeit', 100, 2),
	('Beinarbeit', 100, 2),
	('Finte', 100, 2),
	('Fußfeger', 100, 2),
	('Griff', 100, 2),
	('Halten', 100, 2),
	('Knie', 100, 2),
	('Improvisierte Waffen', 100, 2),
	('Kampfreflexe', 100, 2),
	('Klammer', 100, 2),
	('Knaufschlag', 100, 2),
	('Kopfstoß', 100, 2),
	('Niederringen', 100, 2),
	('Reiterkampf', 100, 2),
	('Schmutzige Tricks', 100, 2),
	('Schnellziehen', 100, 2),
	('Schwitzkasten', 100, 2),
	('Sprung', 100, 2),
	('Tritt', 100, 2),
	('Versteckte Klinge', 100, 2),
	('Waffenloser Kampfstil: Mercenario', 100, 2),
	('Wurf', 100, 2),
	('Ausweichen II', 100, 2),
	('Ausweichen III', 100, 2),
	('Elfenlied: Freundschaftslied', 100, 2),
	('Repräsentation: Elf', 100, 2),
	('Salasandra', 100, 2),
	('Apport', 100, 2),
	('Merkmalskenntnis: Eigenschaften', 100, 2),
	('Merkmalskenntnis: Schaden', 100, 2),
	('Zauberkontrolle', 100, 2),
	('Zauberroutine', 100, 2),
	('Stabzauber: Hammer des Magus', 100, 2),
	('Stabzauber: Kraftfokus', 100, 2),
	('Stabzauber: Zauberspeicher', 100, 2),
	('Gebirgskundig', 100, 2),
	
	('Fass I', 100, 2),
	('Fass II', 100, 2),
	('Gezielter Biss', 100, 2),
	('Kehrtwende', 100, 2),
	('Kommen auf Signal', 100, 2),
	
	('Tanz der Mada', 100, 0);
	
	
	
