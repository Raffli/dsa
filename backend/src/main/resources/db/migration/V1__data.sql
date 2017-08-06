create table talent_kategorien(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
    PRIMARY KEY(id)
);

create table talente(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL UNIQUE,
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
	('Sich Verstecken', 0, 'D'),
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
	('Geographie', 3, 'B'),
	('Gesteinskunde', 3, 'B'),
	('Götter/Kulte', 3, 'B'),
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
	

