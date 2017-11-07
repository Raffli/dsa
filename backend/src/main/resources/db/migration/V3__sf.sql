create table sonderfertigkeiten(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL UNIQUE,
	kosten SMALLINT NOT NULL,
	typ SMALLINT NOT NULL,
	verbreitung SMALLINT, /*NOT NULL LATER */
	PRIMARY KEY(id)
);

/*profan, magisch, kampf, klerikal */

/*TOCHECK: Berufsgeheimnis, Akklimatisierung**/

/* SONDERFÄLLE
	Geländekunde: Erste 150, zweite 100
	Kulturkunde: Erste kostenlos,
	Talentspezialisierung Kosten Berechnung
*/

INSERT INTO sonderfertigkeiten (name, kosten, typ, verbreitung) VALUES 
	('Akklimatisierung (Hitze)', 150, 0, 7),
	('Akklimatisierung (Kälte)', 150, 0, 7),
	('Berufsgeheimnis', 100, 0, 2),
	('Fälscher', 100, 0, 2),
	('Geländekunde', 150,0, 7),
	('Kulturkunde', 150,0, 7),
	('Meister der Improvisation', 200,0,7 ),
	('Nandusgefälliges Wissen', 200,0, 4),
	('Ortskenntnis', 150,0, 7),
	('Rosstäuscher', 100,0, 4),
	('Talentspezialisierung', -1,0, 7);
	
INSERT INTO sonderfertigkeiten (name, kosten, typ, verbreitung) VALUES 
	('Aufmerksamkeit', 200, 2, 5),
	('Ausfall', 200, 2, 4),
	('Ausweichen I', 300, 2, 5),
	('Ausweichen II', 200, 2, 4),
	('Ausweichen III', 200, 2, 3),
	('Befreiungsschlag', 100, 2, 3),
	('Beidhändiger Kampf I', 100, 2, 3),
	('Beidhändiger Kampf II', 100, 2, 2),
	('Berittener Schütze', 200, 2,4 ),
	('Betäubungsschlag', 200, 2,3 ),
	('Binden',200 ,2 ,4 ),
	('Blindkampf', 200 ,2 ,1 ),
	('Defensiver Kampfstil' ,100 ,2 ,4 ),
	('Doppelangriff' ,100 ,2 ,3 ),
	('Eisenhagel' ,150 ,2 ,2 ),
	('Entwaffnen' ,200 ,2 ,3 ),
	('Festnageln' ,200 ,2 ,4 ),
	('Finte' ,200 ,2 ,6 ),
	('Formation' ,100 ,2 ,4 ),
	('Gegenhalten' ,200 ,2 ,3 ),
	('Geschützmeister' ,100 ,2 ,3 ),
	('Gezielter Stich' ,100 ,2 ,4 ),
	('Halbschwert' ,150 ,2 ,4 ),
	('Hammerschlag' ,200 ,2 ,3 ),
	('Improvisierte Waffen' ,100 ,2 ,2 ),
	('Kampf im Wasser' ,100 ,2 ,4 ),
	('Kampfgespür' ,300 ,2 ,3 ),
	('Kampfreflexe' ,300 ,2 ,4 ),
	('Klingensturm' ,100 ,2 ,3 ),
	('Klingentänzer' ,400 ,2 ,1 ),
	('Kriegsreiterei' ,300 ,2 ,3 ),
	('Linkhand' ,300 ,2 ,6 ),
	('Meisterliches Entwaffnen' ,100 ,2 ,2 ),
	('Meisterparade' ,200 ,2 ,5 ),
	('Meisterschütze' ,300 ,2 ,2 ),
	('Niederwerfen' ,100 ,2 ,4 ),
	('Parierwaffen I' ,200 ,2 ,4 ),
	('Parierwaffen II' ,200 ,2 ,3 ),
	('Reiterkampf' ,200 ,2 ,4 ),
	('Reiterkampf(Streitwagen)' ,200 ,2 ,4 ),
	('Rüstungsgewöhnung I' ,150 ,2 ,6 ),
	('Rüstungsgewöhnung II' ,300 ,2 ,4 ),
	('Rüstungsgewöhnung III' ,450 ,2 ,2 ),
	('Scharfschütze' ,300 ,2 ,5 ),
	('Schildkampf I' ,200 ,2 ,4 ),
	('Schildkampf II' ,200 ,2 ,3 ),
	('Schildspalter' ,100 ,2 ,3 ),
	('Schnellladen' , 200,2 ,5 ),
	('Schnellziehen' ,200 ,2 ,4 ),
	('Spießgespann' ,100 ,2 ,2 ),
	('Sturmangriff' ,100 ,2 ,3 ),
	('Tod von Links' ,100 ,2 ,3 ),
	('Todesstoß' ,200 ,2 ,3 ),
	('Turnierreiter' ,100 ,2 ,3 ),
	('Umreißen' ,100 ,2 ,3 ),
	('Unterwasserkampf' ,200 ,2 ,2 ),
	('Waffe zerbrechen' ,200 ,2 ,3 ),
	('Waffenmeister' ,2 ,2 ,400 ),
	('Waffenspezialisierung' ,-1 ,2 ,4 ),
	('Windmühle' ,200 ,2 ,2 ),
	('Wuchtschlag' ,200 ,2 ,7 );
	


INSERT INTO sonderfertigkeiten (name, kosten, typ) VALUES
	('Kraftlinienmagie I', 100, 1),
	('Astrale Meditation', 100, 1),
	('Große Meditation', 100, 1),
	('Merkmalskenntnis: Hellsicht', 100, 1),
	('Merkmalskenntnis: Metamagie', 100, 2),
	('Repräsentation: Magier', 100, 1),
	('Ritualkenntnis: Gildenmagie', 100, 1),
	('Stabzauber: Bindung', 100, 1),
	('Fernzauberei', 100, 1),
	('Regeneration I', 100, 1),
	('Merkmalskenntnis: Umwelt', 100, 1),
	('Stabzauber: Fackel', 100, 1),
	('Merkmalskenntnis: Elementar (Luft)', 100, 1),
	('Elfenlied: Freundschaftslied', 100, 2),
	('Repräsentation: Elf', 100, 2),
	('Salasandra', 100, 2),
	('Apport', 100, 2),
	('Merkmalskenntnis: Eigenschaften', 100, 2),
	('Merkmalskenntnis: Schaden', 100, 2),
	('Zauberkontrolle', 100, 2),
	('Zauberroutine', 100, 2),
	('Blutmagie', 100, 0),
	('Druidenrache', 100, 0),
	('Representation: Druide', 100, 0),
	('Repräsentation: Druide', 100, 0),
	('Verbotene Pforten', 100, 0),
	('Druidisches Dolchritual: Lebenskraft', 100, 0),
	('Druidisches Dolchritual: Leib', 100, 0),
	('Druidisches Dolchritual: Weihe', 100, 0);
	
	
	
