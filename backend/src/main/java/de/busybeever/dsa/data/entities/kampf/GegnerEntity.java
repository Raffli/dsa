package de.busybeever.dsa.data.entities.kampf;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "gegner")
@Data
public class GegnerEntity {

	@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Id
	private Long id;
	
	private String name;
	
	private String json;
}
