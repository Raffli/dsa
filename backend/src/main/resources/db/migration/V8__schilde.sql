create table schilde(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
	wm_at SMALLINT NOT NULL,
	wm_pa SMALLINT NOT NULL,
	bf SMALLINT NOT NULL,
	ini SMALLINT NOT NULL
);	

INSERT INTO schilde(name, wm_at, wm_pa, bf, ini) VALUES
	('Großschild', -2, 5, 2, -2 );
