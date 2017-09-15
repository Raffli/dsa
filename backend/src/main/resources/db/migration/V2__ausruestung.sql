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
	distanzklasse VARCHAR(2) NOT NULL,
    PRIMARY KEY(id)
);


INSERT INTO waffen (name, schaden_w6, schaden_fix, tpKK_minKK,tpKK_mod, ini, bf, typ,distanzklasse, wm_at, wm_pa ) VALUES 
	('Skraja', 1, 3, 12, 3, 0, 4, 'Hi', 'N', 0, 0),
	('Doppelkhunchomer', 1, 6, 12, 2, -1, 2, 'Hi', 'NS', 0, -1),
	('Dolch', 1, 1, 12, 5, 0, 2, 'Do', 'H', 0, -1),
	('Barbarenstreitaxt', 3,2,15,1,-2,3,'2H','N',-1,-4),
	('Wurfbeil', 1,3,10,4,-1,2,'Hi','H',0,-2);
	


create table fkwaffen(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL,
	typ VARCHAR(10) NOT NULL,
	schaden_w6 SMALLINT NOT NULL,
	schaden_fix SMALLINT NOT NULL,
	entfernung VARCHAR(20) NOT NULL,
	tpentfernung VARCHAR(20) NOT NULL,
	ladezeit SMALLINT NOT NULL

);

INSERT INTO fkwaffen(name, typ, schaden_w6, schaden_fix, entfernung, tpentfernung, ladezeit) VALUES
	('Wurfbeil', 'Wb', 1, 3, '0/5/10/15/25', '0/1/1/0/-1', 1),
	('Wurfmesser', 'Wm', 1,0, '2/4/6/8/15', '1/0/0/0/-1', 1);
	
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
	
create table ruestungen(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(35) NOT NULL,
	stats_be FLOAT NOT NULL,
	stats_rs FLOAT NOT NULL,
	stats_kopf FLOAT NOT NULL,
  	stats_brust FLOAT NOT NULL,
  	stats_ruecken FLOAT NOT NULL,
  	stats_bauch FLOAT NOT NULL,
  	stats_linkerarm FLOAT NOT NULL,
  	stats_rechterarm FLOAT NOT NULL,
  	stats_linkesbein FLOAT NOT NULL,
  	stats_rechtsbein FLOAT NOT NULL
);

INSERT INTO ruestungen(name, stats_be, stats_rs, stats_kopf,stats_brust, stats_ruecken, stats_bauch, stats_linkerarm, stats_rechterarm,
	stats_linkesbein, stats_rechtsbein) VALUES
	('Gambeson', 1.5, 1.5, 0, 2, 2,2,1,1,1,1),
	('Drachenhelm', 0.5, 0.5, 3,0,1,0,0,0,0,0),
	('Kettenhemd, Lang', 2.1,3.1, 0,4,4,4,3,3,2,2);
	
INSERT INTO ruestungen(name, stats_kopf,stats_brust, stats_ruecken, stats_bauch, stats_linkerarm, stats_rechterarm, stats_linkesbein, stats_rechtsbein, stats_rs, stats_be) VALUES
	('Armschienen (Paar), Leder', 0, 0, 0, 0, 1, 1, 0, 0, 0.1, 0.1),
	('Beinschienen (Paar), Leder', 0, 0, 0, 0, 0, 0, 1, 1, 0.2, 0.2),
	('Armschienen (Paar), Stahl', 0, 0, 0, 0, 3, 3, 0, 0,  0.3, 0.3),
	('Lederharnisch', 0, 3, 3, 3, 0, 0, 0, 0, 1.8, 1.8),
	('Dicke Kleidung', 0, 1, 1, 1, 1, 1, 1, 1, 0.9, 0.9),
	('Krötenhaut', 0, 3, 2, 2, 1, 1, 0, 0,  1.5, 0.5);
	
	