create table waffen(
	id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) NOT NULL UNIQUE,
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
	('Anderthalbhänder', 1, 5, 11, 4, 1, 1, 'An', 'NS', 0, 0),
	('Rondrakamm', 2, 2, 12, 3, 0, 1, 'An', 'NS', 0, 0),
	('Tuzakmesser', 1, 6, 12, 4, 1, 1, 'An', 'NS', 0, 0),
	('Basiliskenzunge', 1, 2, 12, 4, -1, 4, 'Do', 'H', 0, -1),
	('Borndorn', 1, 2, 12, 5, 0, 1, 'Do', 'H', 0, -1),
	('Dolch', 1, 1, 12, 5, 0, 2, 'Do', 'H', 0, -1),
	('Drachenzahn', 1, 2, 11, 4, 0, 0, 'Do', 'H', 0, 0),
	('Eberfänger', 1, 2, 12, 4, 0, 1, 'Do', 'H', 0, -1),
	('Hakendolch', 1, 1, 12, 4, 0, -2, 'Do', 'HN', 0, 1),
	('Jagdmesser', 1, 2, 12, 5, -1, 3, 'Do', 'H', 0, -2),
	('Kurzschwert', 1, 2, 11, 4, 0, 1, 'Do', 'HN', 0, -1),
	('Langdolch', 1, 2, 12, 4, 0, 1, 'Do', 'H', 0, 0),
	('Linkhand', 1, 1, 12, 5, 0, 0, 'Do', 'H', 0, 1),
	('Mengbilar', 1, 1, 12, 5, -2, 7, 'Do', 'H', 0, -3),
	('Messer', 1, 0, 12, 6, -2, 4, 'Do', 'H', -2, -3),
	('Ogerfänger', 1, 2, 12, 4, 0, 4, 'Do', 'H', 0, -2),
	('Scheibendolch', 1, 2, 11, 4, 0, 0, 'Do', 'H', 0, -3),
	('Schwerer Dolch', 1, 2, 12, 4, 0, 1, 'Do', 'H', 0, -1),
	('Vulkanglasdolch', 1, -1, 12, 5, -2, 6, 'Do', 'H', -2, -3),
	('Wurfdolch', 1, 1, 12, 5, -1, 2, 'Do', 'H', -1, -2),
	('Wurfmesser', 1, -1, 12, 6, -1, 2, 'Do', 'H', -2, -3),
	('Degen', 1, 3, 12, 5, 2, 3, 'Fe', 'N', 0, -1),
	('Florett', 1, 3, 13, 5, 3, 4, 'Fe', 'N', 1, -1),
	('Magierdegen', 1, 2, 13, 5, 1, 4, 'Fe', 'N', 0, -2),
	('Panzerstecher', 1, 4, 13, 3, 0, 0, 'Fe', 'N', -1, -1),
	('Rapier', 1, 3, 12, 4, 1, 2, 'Fe', 'N', 0, 0),
	('Robbentöter', 1, 3, 12, 4, 0, 2, 'Fe', 'N', 0, 0),
	('Stockdegen', 1, 3, 12, 5, 0, 4, 'Fe', 'N', -1, -3),
	('Brabakbengel', 1, 5, 13, 3, 0, 1, 'Hi', 'N', 0, -1),
	('Byakka', 1, 5, 14, 2, -1, 3, 'Hi', 'N', 0, -2),
	('Fackel', 1, 0, 11, 5, -2, 8, 'Hi', 'HN', -2, -3),
	('Fleischerbeil', 1, 2, 11, 4, -1, 2, 'Hi', 'H', -2, -3),
	('Keule', 1, 2, 11, 3, 0, 3, 'Hi', 'N', 0, -2),
	('Knochenkeule', 1, 3, 11, 3, 0, 3, 'Hi', 'N', 0, -1),
	('Knüppel', 1, 1, 11, 4, 0, 6, 'Hi', 'N', 0, -2),
	('Kriegsfächer', 1, 2, 12, 5, 0, 3, 'Hi', 'H', 0, 1),
	('Lindwurmschläger', 1, 4, 11, 3, -1, 1, 'Hi', 'HN', 0, -1),
	('Molokdeschnaja', 1, 4, 11, 3, 0, 3, 'Hi', 'N', 0, 0),
	('Rabenschnabel', 1, 4, 10, 4, 0, 3, 'Hi', 'N', 0, 0),
	('Schmiedehammer', 1, 4, 14, 2, -1, 1, 'Hi', 'N', -1, -1),
	('Sichel', 1, 2, 12, 5, -2, 6, 'Hi', 'H', -2, -2),
	('Skraja', 1, 3, 11, 3, 0, 4, 'Hi', 'N', 0, 0),
	('Sonnenszepter', 1, 3, 12, 3, 0, 1, 'Hi', 'N', -1, -1),
	('Streitaxt', 1, 4, 13, 2, 0, 2, 'Hi', 'N', 0, -1),
	('Streitkolben', 1, 4, 11, 3, 0, 1, 'Hi', 'N', 0, -1),
	('Stuhlbein', 1, 0, 11, 5, -1, 8, 'Hi', 'HN', -1, -1),
	('Wurfbeil', 1, 3, 10, 4, -1, 2, 'Hi', 'H', 0, -2),
	('Wurfkeule', 1, 2, 12, 5, -1, 3, 'Hi', 'H', -1, -1),
	('Zwergenskraja', 1, 3, 11, 3, 0, 1, 'Hi', 'HN', 0, 0),
	('Glefe', 1, 4, 13, 3, -1, 5, 'In', 'S', 0, -2),
	('Hakenspieß', 1, 3, 13, 4, 0, 5, 'In', 'S', -1, -1),
	('Hellebarde', 1, 5, 12, 3, 0, 5, 'In', 'S', 0, -1),
	('Pailos', 2, 4, 14, 2, -2, 3, 'In', 'S', -1, -3),
	('Sense', 1, 3, 13, 4, -2, 7, 'In', 'S', -2, -4),
	('Sturmsense', 1, 4, 13, 3, -1, 5, 'In', 'S', -1, -2),
	('Warunker Hammer', 1, 6, 14, 3, -1, 2, 'In', 'NS', 0, -1),
	('Wurmspieß', 1, 5, 13, 4, 0, 2, 'In', 'S', 0, -2),
	('Dreigliederstab', 1, 2, 13, 4, 2, 3, 'Ks', 'HN', 1, 1),
	('Kettenstab', 1, 2, 13, 4, 2, 2, 'Ks', 'HN', 1, 0),
	('Geißel', 1, -1, 14, 5, -1, 5, 'Kw', 'N', 0, -4),
	('Kettenkugel', 3, 0, 16, 2, -3, 2, 'Kw', 'S', -2, -4),
	('Morgenstern', 1, 5, 14, 2, -1, 2, 'Kw', 'N', -1, -2),
	('Neunschwänzige', 1, 1, 14, 4, -1, 5, 'Kw', 'N', -1, -4),
	('Ochsenherde', 3, 3, 17, 1, -3, 3, 'Kw', 'N', -2, -4),
	('Ogerschelle', 2, 2, 15, 1, -2, 3, 'Kw', 'N', -1, -3),
	('Peitsche', 1, 0, 14, 5, 0, 4, 'Pe', 'S', 0, 0),
	('Entermesser', 1, 3, 12, 4, 0, 2, 'Sä', 'N', 0, 0),
	('Haumesser', 1, 3, 13, 3, -1, 3, 'Sä', 'HN', 0, -2),
	('Khunchomer', 1, 4, 12, 3, 0, 2, 'Sä', 'N', 0, 0),
	('Sklaventod', 1, 4, 12, 3, 0, 3, 'Sä', 'N', 0, 0),
	('Waqqif', 1, 2, 12, 5, -2, 2, 'Sä', 'H', -1, -3),
	('Amazonensäbel', 1, 4, 11, 4, 1, 2, 'Sc', 'N', 0, 0),
	('Arbach', 1, 4, 12, 3, 0, 2, 'Sc', 'N', 0, -1),
	('Barbarenschwert', 1, 5, 13, 2, -1, 4, 'Sc', 'N', 0, -1),
	('Bastardschwert', 1, 5, 12, 4, -1, 2, 'Sc', 'N', 0, -1),
	('Breitschwert', 1, 4, 12, 3, 0, 1, 'Sc', 'N', 0, -1),
	('Kusliker Säbel', 1, 3, 12, 4, 1, 1, 'Sc', 'N', 0, 0),
	('Nachtwind', 1, 4, 11, 5, 2, 0, 'Sc', 'N', 0, 0),
	('Säbel', 1, 3, 12, 4, 1, 2, 'Sc', 'N', 0, 0),
	('Schwert', 1, 4, 11, 4, 0, 1, 'Sc', 'N', 0, 0),
	('Turnierschwert', 1, 3, 11, 5, 0, 3, 'Sc', 'N', 0, 0),
	('Wolfsmesser', 1, 3, 12, 4, 1, 1, 'Sc', 'N', 0, 0),
	('Drachentöter', 3, 5, 20, 1, -3, 3, 'Sp', 'P', -2, -4),
	('Dreizack', 1, 4, 13, 3, 0, 5, 'Sp', 'S', 0, -1),
	('Dschadra', 1, 5, 12, 4, -1, 6, 'Sp', 'S', 0, -3),
	('Efferdbart', 1, 4, 13, 3, 0, 3, 'Sp', 'NS', 0, -1),
	('Holzspeer', 1, 3, 12, 5, 0, 5, 'Sp', 'S', -1, -3),
	('Jagdspieß', 1, 6, 12, 4, -1, 3, 'Sp', 'S', 0, -1),
	('Korspieß', 2, 2, 12, 3, 0, 3, 'Sp', 'S', 0, -1),
	('Kriegslanze', 1, 3, 12, 5, -2, 5, 'Sp', 'P', -2, -4),
	('Partisane', 1, 5, 13, 3, 0, 4, 'Sp', 'S', 0, -2),
	('Pike', 1, 5, 14, 4, -2, 6, 'Sp', 'P', -1, -2),
	('Speer', 1, 5, 12, 4, -1, 5, 'Sp', 'S', 0, -2),
	('Stoßspeer', 2, 2, 11, 4, -1, 3, 'Sp', 'S', 0, -1),
	('Turnierlanze', 1, 2, 12, 5, -2, 8, 'Sp', 'P', -2, -4),
	('Wurfspeer', 1, 3, 11, 5, -2, 4, 'Sp', 'N', -1, -3),
	('Kampfstab', 1, 1, 12, 4, 1, 5, 'St', 'NS', 0, 0),
	('Magierstab', 1, 1, 11, 5, 0, 0, 'St', 'NS', -1, -1),
	('Zweililien', 1, 3, 12, 4, 1, 4, 'St', 'N', 1, -1),
	('Dreschflegel', 1, 3, 12, 3, -2, 6, '2F', 'S', -2, -3),
	('Kriegsflegel', 1, 6, 12, 2, -1, 5, '2F', 'S', -1, -2),
	('Echsische Axt', 1, 5, 12, 4, 0, 3, '2H', 'NS', 0, -1),
	('Felsspalter', 2, 2, 14, 2, -1, 2, '2H', 'N', 0, -2),
	('Gruufhai', 1, 6, 14, 2, -2, 3, '2H', 'N', -1, -3),
	('Holzfälleraxt', 2, 0, 12, 2, -2, 5, '2H', 'N', -1, -4),
	('Kriegshammer', 2, 3, 14, 2, -2, 2, '2H', 'N', -1, -3),
	('Neethaner Langaxt', 2, 2, 13, 4, -2, 5, '2H', 'S', -1, -3),
	('Orknase', 1, 5, 12, 2, -1, 4, '2H', 'N', 0, -1),
	('Schnitter', 1, 5, 14, 4, 0, 4, '2H', 'NS', 0, 0),
	('Spitzhacke', 1, 6, 13, 2, -3, 5, '2H', 'N', -2, -4),
	('Vorschlaghammer', 1, 5, 13, 2, -3, 5, '2H', 'N', -2, -4),
	('Zwergenschlägel', 1, 5, 13, 3, -1, 1, '2H', 'N', 0, -1),
	('Andergaster', 3, 2, 14, 2, -3, 3, '2S', 'S', 0, -2),
	('Boronssichel', 2, 6, 13, 3, -2, 3, '2S', 'S', 0, -3),
	('Doppelkhunchomer', 1, 6, 12, 2, -1, 2, '2S', 'NS', 0, -1),
	('Großer Sklaventod', 2, 4, 13, 2, -2, 3, '2S', 'NS', 0, -2),
	('Richtschwert', 3, 4, 13, 2, -3, 5, '2S', 'N', -2, -4),
	('Zweihänder', 2, 4, 12, 3, -1, 2, '2S', 'NS', 0, -1);