package de.busybeever.dsa.data.entities.talente;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.ToString;

@Entity
@Table(name="sprachen")
public class SprachEntity extends SprachBaseEntity{

	{
		this.setKategorie("Sprachen");
	}
	
	
}
