package de.busybeever.dsa.data.entities.talente;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="sprachen")
public class SprachEntity extends SprachBaseEntity{

	
	public String getKategorie() {
		return "Sprachen";
	}
}
