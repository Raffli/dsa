package de.busybeever.dsa.data.entities;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="sprachen")
public class SprachEntity extends SprachBaseEntity{

	public String getKategorie() {
		return "Sprachen";
	}
}
