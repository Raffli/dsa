create table talent_kategorien(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
    PRIMARY KEY(id)
);

create table talente(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(40) NOT NULL UNIQUE,
	kategorie_id BIGINT NOT NULL,
	komplexitaet varchar(5) NOT NULL,
    PRIMARY KEY(id)
);


INSERT INTO talent_kategorien VALUES(0, 'Körperlich');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES 
	('Akrobatik', 0, 'D'),
	('Athletik', 0, 'D'),
	('Fliegen', 0, 'D'),
	('Gaukeleien', 0, 'D'),
	('Klettern', 0, 'D'),
	('Körperbeherrschung', 0, 'D'),
	('Reiten', 0, 'D'),
	('Schleichen', 0, 'D'),
	('Schwimmen', 0, 'D'),
	('Selbstbeherrschung', 0, 'D'),
	('Sich verstecken', 0, 'D'),
	('Singen', 0, 'D'),
	('Sinnenschärfe', 0, 'D'),
	('Skifahren', 0, 'D'),
	('Stimmen Imitieren', 0, 'D'),
	('Tanzen', 0, 'D'),
	('Taschendiebstahl', 0, 'D'),
	('Zechen', 0, 'D');

INSERT INTO talent_kategorien VALUES(1, 'Gesellschaftlich');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES 
	('Betören', 1, 'B'),
	('Etikette', 1, 'B'),
	('Gassenwissen', 1, 'B'),
	('Lehren', 1, 'B'),
	('Menschenkenntnis', 1, 'B'),
	('Schauspielerei', 1, 'B'),
	('Schriftlicher Ausdruck', 1, 'B'),
	('Sich Verkleiden', 1, 'B'),
	('Überreden', 1, 'B'),
	('Überzeugen', 1, 'B');

INSERT INTO talent_kategorien VALUES(2, 'Natur');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES 
	('Fährtensuchen', 2, 'B'),
	('Fallenstellen', 2, 'B'),
	('Fesseln/Entfesseln', 2, 'B'),
	('Fischen/Angeln', 2, 'B'),
	('Orientierung', 2, 'B'),
	('Wettervorhersage', 2, 'B'),
	('Wildnisleben', 2, 'B');

	
INSERT INTO talent_kategorien VALUES(3, 'Wissen');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES
	('Anatomie', 3, 'B'),
	('Baukunst', 3, 'B'),
	('Brett-/Kartenspiel', 3, 'B'),
	('Geografie', 3, 'B'),
	('Geschichtswissen', 3, 'B'),
	('Gesteinskunde', 3, 'B'),
	('Götter und Kulte', 3, 'B'),
	('Heraldik', 3, 'B'),
	('Hüttenkunde', 3, 'B'),
	('Kriegskunst', 3, 'B'),
	('Kryptographie', 3, 'B'),
	('Magiekunde', 3, 'B'),
	('Mechanik', 3, 'B'),
	('Pflanzenkunde', 3, 'B'),
	('Philosophie', 3, 'B'),
	('Rechnen', 3, 'B'),
	('Rechtskunde', 3, 'B'),
	('Sagen und Legenden', 3, 'B'),
	('Schätzen', 3, 'B'),
	('Sprachenkunde', 3, 'B'),
	('Staatskunst', 3, 'B'),
	('Sternkunde', 3, 'B'),
	('Tierkunde', 3, 'B');
	
INSERT INTO talent_kategorien VALUES(4, 'Kampf');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES
	('Anderthalbhänder', 4, 'E'),
	('Armbrust', 4, 'C'),
	('Belagerungswaffen', 4, 'D'),
	('Blasrohr', 4, 'D'),
	('Bogen', 4, 'E'),
	('Diskus', 4, 'D'),
	('Dolche', 4, 'D'),
	('Fechtwaffen', 4, 'E'),
	('Hiebwaffen', 4, 'D'),
	('Infanteriewaffen', 4, 'D'),
	('Kettenstäbe', 4, 'E'),
	('Kettenwaffen', 4, 'D'),
	('Lanzenreiten', 4, 'E'),
	('Peitsche', 4, 'E'),
	('Raufen', 4, 'C'),
	('Ringen', 4, 'D'),
	('Säbel', 4, 'D'),
	('Schleuder', 4, 'E'),
	('Schwerter', 4, 'E'),
	('Speere', 4, 'D'),
	('Stäbe', 4, 'D'),
	('Wurfbeile', 4, 'D'),
	('Wurfmesser', 4, 'C'),
	('Wurfspeere', 4, 'C'),
	('Zweihandflegel', 4, 'D'),
	('Zweihand-Hiebwaffen', 4, 'D'),
	('Zweihandschwerter/-säbel', 4, 'D');
	
INSERT INTO talent_kategorien VALUES(5, 'Handwerk');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES
	('Abrichten', 5, 'B'),
	('Ackerbau', 5, 'B'),
	('Alchimie', 5, 'B'),
	('Bergbau', 5, 'B'),
	('Bogenbau', 5, 'B'),
	('Boote fahren', 5, 'B'),
	('Drucker', 5, 'B'),
	('Fahrzeug Lenken', 5, 'B'),
	('Falschspiel', 5, 'B'),
	('Feinmechanik', 5, 'B'),
	('Feuersteinbearbeitung', 5, 'B'),
	('Fleischer', 5, 'B'),
	('Gerber/Kürschner', 5, 'B'),
	('Glaskunst', 5, 'B'),
	('Handel', 5, 'B'),
	('Hauswirtschaft', 5, 'B'),
	('Heilkunde: Gift', 5, 'B'),
	('Heilkunde: Krankheiten', 5, 'B'),
	('Heilkunde: Seele', 5, 'B'),
	('Heilkunde: Wunden', 5, 'B'),
	('Holzbearbeitung', 5, 'B'),
	('Instrumentenbauer', 5, 'B'),
	('Kartographie', 5, 'B'),
	('Kochen', 5, 'B'),
	('Kristallzucht', 5, 'B'),
	('Lederarbeiten', 5, 'B'),
	('Malen/Zeichnen', 5, 'B'),
	('Maurer', 5, 'B'),
	('Metallguss', 5, 'B'),
	('Musizieren', 5, 'B'),
	('Schlösser Knacken', 5, 'B'),
	('Schnaps Brennen', 5, 'B'),
	('Schneidern', 5, 'B'),
	('Seefahrt', 5, 'B'),
	('Seiler', 5, 'B'),
	('Steinmetz', 5, 'B'),
	('Steinschneider/Juwelier', 5, 'B'),
	('Stellmacher', 5, 'B'),
	('Stoffe Färben', 5, 'B'),
	('Tätowieren', 5, 'B'),
	('Töpfern', 5, 'B'),
	('Viehzucht', 5, 'B'),
	('Webkunst', 5, 'B'),
	('Winzer', 5, 'B'),
	('Zimmermann', 5, 'B');
	
INSERT INTO talent_kategorien VALUES(6, 'Gaben');	

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES
	('Ritualkenntnis: Gildenmagie', 6, 'E');


	
	
create table sprachen(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(40) NOT NULL UNIQUE,
	lernkomplexitaet varchar(5) NOT NULL,
    komplexitaet INTEGER NOT NULL,
    PRIMARY KEY(id)
);



INSERT INTO sprachen (name, komplexitaet, lernkomplexitaet) VALUES
	('Garethi', 7, 'A'),
	('Bosparano', 7, 'A'),
	('Aureliani', 7, 'A'),
	('Zyklopisch', 7, 'A'),
	('Tulamidya', 7, 'A'),
	('Ur-Tulamidya', 7, 'A'),
	('Zelemja', 7, 'A'),
	('Alaani', 7, 'A'),
	('Zhulchammaqra', 7, 'A'),
	('Ferkina', 7, 'A'),
	('Ruuz', 7, 'A'),
	('Alte Kemi', 7, 'A'),
	('Rabensprache', 7, 'A'),
	('Nujuka', 7, 'A'),
	('Mohisch', 7, 'A'),
	('Thorwalsch', 7, 'A'),
	('Hjaldingsch', 7, 'A'),
	('Isdira', 7, 'B'),
	('Asdharia', 7, 'B'),
	('Rogolan', 7, 'A'),
	('Orkisch', 7, 'A'),
	('Ologhaijan', 7, 'A'),
	('Goblinisch', 7, 'A'),
	('Trollisch', 7, 'A'),
	('Rssahh', 7, 'B'),
	('Mahrisch', 7, 'A'),
	('Rissoal', 7, 'A'),
	('Molochisch', 7, 'A'),
	('Neckergesang', 7, 'A'),
	('Grolmisch', 7, 'A'),
	('Z''Lit', 7, 'A'),
	('Koboldisch', 7, 'A'),
	('Zhayad', 7, 'A'),
	('Atak', 7, 'A'),
	('Füchsisch', 7, 'A');

create table schriften(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(40) NOT NULL UNIQUE,
	lernkomplexitaet varchar(5) NOT NULL,
    komplexitaet INTEGER NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO schriften (name, komplexitaet, lernkomplexitaet) VALUES
	('Altes Alaani', 8, 'A'),
	('Altes Kemi', 8, 'A'),
	('Amulashtra', 8, 'A'),
	('Angram', 8, 'A'),
	('Arkanil', 8, 'C'),
	('Chrmk', 8, 'A'),
	('Chuchas', 8, 'B'),
	('Drakhard-Zinken', 8, 'A'),
	('Drakned-Glyphen', 8, 'B'),
	('Geheiligte Glyphen von Unau', 8, 'A'),
	('Gimaril', 8, 'A'),
	('Gjalskisch', 8, 'A'),
	('Hjaldingsche Runen', 8, 'A'),
	('Imperiale Zeichen', 8, 'A'),
	('Isdira / Asdharia', 8, 'A'),
	('Kusliker Zeichen', 8, 'A'),	
	('Mahrische Glyphen', 8, 'B'),	
	('Nanduria', 8, 'A'),	
	('Rogolan', 8, 'A'),	
	('Trollische Raumbilderschrift', 8, 'C'),	
	('Tulamidya', 8, 'A'),	
	('Ur-Tulamidya ', 8, 'A'),	
	('Zhayad', 8, 'A');
	
	create table helden(
	id BIGINT NOT NULL AUTO_INCREMENT,
	xml TEXT NOT NULL,
	name varchar(50) UNIQUE NOT NULL
);