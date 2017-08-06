create table talent_kategorien(
	id BIGINT NOT NULL,
	name varchar(25) NOT NULL
);
create table talente(
	id BIGINT NOT NULL,
	name varchar(25) NOT NULL UNIQUE,
	kategorie_id BIGINT NOT NULL,
	komplexitaet varchar(5) NOT NULL
);

INSERT INTO talent_kategorien VALUES(0, 'Gesellschaft');

INSERT INTO talente VALUES(0, 'Überreden', 0, 'A');
INSERT INTO talente VALUES(1, 'Überzeugen', 0, 'A');