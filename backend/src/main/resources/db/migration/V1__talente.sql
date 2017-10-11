create table talent_kategorien(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
    PRIMARY KEY(id)
);

create table IF NOT EXISTS talente(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(40) NOT NULL UNIQUE,
	kategorie_id BIGINT NOT NULL,
	komplexitaet varchar(5) NOT NULL,
	be varchar(5),
    PRIMARY KEY(id)
);


INSERT INTO talent_kategorien VALUES(0, 'Körperlich');

INSERT INTO talente (name, kategorie_id, komplexitaet, be) VALUES 
	('Akrobatik', 0, 'D', 'BEx2'),
	('Athletik', 0, 'D', 'BEx2'),
	('Fliegen', 0, 'D', 'BE'),
	('Gaukeleien', 0, 'D', 'BEx2'),
	('Klettern', 0, 'D', 'BEx2'),
	('Körperbeherrschung', 0, 'D', 'BEx2'),
	('Reiten', 0, 'D', ' BE-2'),
	('Schleichen', 0, 'D', 'BE'),
	('Schwimmen', 0, 'D', 'BEx2'),
	('Selbstbeherrschung', 0, 'D', ''),
	('Sich verstecken', 0, 'D', 'BE-2'),
	('Singen', 0, 'D', 'BE-3'),
	('Sinnenschärfe', 0, 'D', ''),
	('Skifahren', 0, 'D', 'BE-2'),
	('Stimmen Imitieren', 0, 'D', 'BE-4'),
	('Tanzen', 0, 'D', 'BEx2'),
	('Taschendiebstahl', 0, 'D', 'BEx2'),
	('Zechen', 0, 'D', '');

INSERT INTO talent_kategorien VALUES(1, 'Gesellschaftlich');

INSERT INTO talente (name, kategorie_id, komplexitaet, be) VALUES 
	('Betören', 1, 'B', 'BE-2'),
	('Etikette', 1, 'B', 'BE-2'),
	('Gassenwissen', 1, 'B', 'BE-4'),
	('Lehren', 1, 'B', ''),
	('Menschenkenntnis', 1, 'B', ''),
	('Schauspielerei', 1, 'B', ''),
	('Schriftlicher Ausdruck', 1, 'B', ''),
	('Sich verkleiden', 1, 'B', ''),
	('Überreden', 1, 'B', ''),
	('Überzeugen', 1, 'B', '');

INSERT INTO talent_kategorien VALUES(2, 'Natur');

INSERT INTO talente (name, kategorie_id, komplexitaet, be) VALUES 
	('Fährtensuchen', 2, 'B', ''),
	('Fallen stellen', 2, 'B', ''),
	('Fesseln/Entfesseln', 2, 'B', ''),
	('Fischen/Angeln', 2, 'B', ''),
	('Orientierung', 2, 'B', ''),
	('Wettervorhersage', 2, 'B', ''),
	('Wildnisleben', 2, 'B', '');

	
INSERT INTO talent_kategorien VALUES(3, 'Wissen');

INSERT INTO talente (name, kategorie_id, komplexitaet, be) VALUES
	('Anatomie', 3, 'B', ''),
	('Baukunst', 3, 'B', ''),
	('Brett-/Kartenspiel', 3, 'B', ''),
	('Geografie', 3, 'B', ''),
	('Geschichtswissen', 3, 'B', ''),
	('Gesteinskunde', 3, 'B', ''),
	('Götter und Kulte', 3, 'B', ''),
	('Heraldik', 3, 'B', ''),
	('Hüttenkunde', 3, 'B', ''),
	('Kriegskunst', 3, 'B', ''),
	('Kryptographie', 3, 'B', ''),
	('Magiekunde', 3, 'B', ''),
	('Mechanik', 3, 'B', ''),
	('Pflanzenkunde', 3, 'B', ''),
	('Philosophie', 3, 'B', ''),
	('Rechnen', 3, 'B', ''),
	('Rechtskunde', 3, 'B', ''),
	('Sagen und Legenden', 3, 'B', ''),
	('Schätzen', 3, 'B', ''),
	('Sprachenkunde', 3, 'B', ''),
	('Staatskunst', 3, 'B', ''),
	('Sternkunde', 3, 'B', ''),
	('Tierkunde', 3, 'B', '');
	
INSERT INTO talent_kategorien VALUES(4, 'Kampf');

INSERT INTO talente (name, kategorie_id, komplexitaet,be) VALUES
	('Anderthalbhänder', 4, 'E', 'BE-2'),
	('Armbrust', 4, 'C', 'BE-5'),
	('Belagerungswaffen', 4, 'D', ''),
	('Blasrohr', 4, 'D', 'BE-5'),
	('Bogen', 4, 'E', 'BE-3'),
	('Diskus', 4, 'D', 'BE-2'),
	('Dolche', 4, 'D', 'BE-1'),
	('Fechtwaffen', 4, 'E', 'BE-1'),
	('Hiebwaffen', 4, 'D', 'BE-4'),
	('Infanteriewaffen', 4, 'D', 'BE-3'),
	('Kettenstäbe', 4, 'E', 'BE-1'),
	('Kettenwaffen', 4, 'D', 'BE-3'),
	('Lanzenreiten', 4, 'E', null),
	('Peitsche', 4, 'E', 'BE-1'),
	('Raufen', 4, 'C', 'BE'),
	('Ringen', 4, 'D', 'BE'),
	('Säbel', 4, 'D', 'BE-2'),
	('Schleuder', 4, 'E', 'BE-2'),
	('Schwerter', 4, 'E', 'BE-2'),
	('Speere', 4, 'D', 'BE-3'),
	('Stäbe', 4, 'D', 'BE-2'),
	('Wurfbeile', 4, 'D', 'BE-2'),
	('Wurfmesser', 4, 'C', 'BE-3'),
	('Wurfspeere', 4, 'C', 'BE-2'),
	('Zweihandflegel', 4, 'D', 'BE-3'),
	('Zweihandhiebwaffen', 4, 'D', 'BE-3'),
	('Zweihandschwerter/-säbel', 4, 'D', 'BE-2');
	
INSERT INTO talent_kategorien VALUES(5, 'Handwerk');

INSERT INTO talente (name, kategorie_id, komplexitaet) VALUES
	('Abrichten', 5, 'B'),
	('Ackerbau', 5, 'B'),
	('Alchimie', 5, 'B'),
	('Bergbau', 5, 'B'),
	('Bogenbau', 5, 'B'),
	('Boote fahren', 5, 'B'),
	('Drucker', 5, 'B'),
	('Fahrzeug lenken', 5, 'B'),
	('Falschspiel', 5, 'B'),
	('Feinmechanik', 5, 'B'),
	('Feuersteinbearbeitung', 5, 'B'),
	('Fleischer', 5, 'B'),
	('Gerber/Kürschner', 5, 'B'),
	('Grobschmied', 5, 'B'),
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
	('Ritualkenntnis: Gildenmagie', 6, 'E'),
	('Gefahreninstinkt', 6, 'E');

	
	
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
	('Urtulamidya', 7, 'A'),
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
	('Alt-Imperial/Aureliani', 7, 'A'),
	('Oloarkh', 7, 'A'),
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
	('(Alt-)Imperiale Zeichen', 8, 'A'),
	('Isdira/Asdharia', 8, 'A'),
	('Kusliker Zeichen', 8, 'A'),	
	('Mahrische Glyphen', 8, 'B'),	
	('Nanduria', 8, 'A'),	
	('Rogolan', 8, 'A'),	
	('Trollische Raumbilderschrift', 8, 'C'),	
	('Tulamidya', 8, 'A'),	
	('Urtulamidya', 8, 'A'),	
	('Zhayad', 8, 'A');
	
