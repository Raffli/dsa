package de.busybeever.dsa.data.entities.talente;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.busybeever.dsa.data.entities.enums.SonderfertigkeitTyp;
import lombok.Data;

@Entity
@Table(name="sonderfertigkeiten")
@Data
public class SonderfertigkeitEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.ORDINAL)
	private SonderfertigkeitTyp typ;
	
	private String name;
	
	private int kosten;
	
	
	
}
