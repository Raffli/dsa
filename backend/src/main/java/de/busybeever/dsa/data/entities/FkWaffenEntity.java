package de.busybeever.dsa.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.busybeever.dsa.data.entities.embeddable.Schaden;
import de.busybeever.dsa.data.entities.embeddable.TpKK;
import de.busybeever.dsa.data.entities.embeddable.WM;
import lombok.Data;

@Data
@Table(name = "fkwaffen")
@Entity
public class FkWaffenEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String typ;
	
	private Schaden schaden;
	
	private String entfernung;
	
	private String tpentfernung;
	
}
