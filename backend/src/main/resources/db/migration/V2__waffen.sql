create table waffen(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
	schaden_w6 SMALLINT NOT NULL,
	schaden_fix SMALLINT NOT NULL,
	tpKK_minKK SMALLINT NOT NULL,
	tpKK_mod SMALLINT NOT NULL,
	wm_at SMALLINT NOT NULL,
	wm_pa SMALLINT NOT NULL,
	ini SMALLINT NOT NULL,
	bf SMALLINT NOT NULL,
	typ VARCHAR(10) NOT NULL,
	be SMALLINT NOT NULL,
	distanzklasse VARCHAR(1) NOT NULL,
    PRIMARY KEY(id)
);


INSERT INTO waffen (name, schaden_w6, schaden_fix, tpKK_minKK,tpKK_mod, ini, bf, typ, be,distanzklasse, wm_at, wm_pa ) VALUES 
	('Skraja', 1, 3, 12, 3, 0, 4, 'Hi', -4, 'N', 0, 0)

