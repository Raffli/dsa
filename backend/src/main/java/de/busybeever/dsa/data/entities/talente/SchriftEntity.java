package de.busybeever.dsa.data.entities.talente;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="schriften")
public class SchriftEntity extends SprachBaseEntity{

	{
		this.setKategorie("Schrift");
	}
}
