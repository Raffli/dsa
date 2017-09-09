package de.busybeever.dsa.data.entities.ausruestung;

import javax.persistence.Embedded;
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
@Table(name = "waffen")
@Entity
public class WaffenEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Embedded
	private Schaden schaden;
	
	@Embedded
	private TpKK tpKK;
	
	@Embedded
	private WM wm;
	
	private String name;
	
	private int ini;
	
	private int bf;
	
	private String typ;
	
	private char distanzklasse;
	
	
	
}
