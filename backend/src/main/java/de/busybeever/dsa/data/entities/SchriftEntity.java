package de.busybeever.dsa.data.entities;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="schriften")
public class SchriftEntity extends SprachBaseEntity{

	public String getKategorie() {
		return "Schrift";
	}
}
