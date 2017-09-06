package de.busybeever.dsa.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.busybeever.dsa.data.entities.embeddable.WM;
import lombok.Data;

@Entity
@Table(name = "schilde")
@Data
public class SchildEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private WM wm;
	
	private int bf;
	
	private int ini;
	
}
