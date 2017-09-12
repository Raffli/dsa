package de.busybeever.dsa.data.entities.ausruestung;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.busybeever.dsa.data.entities.embeddable.RuestungStats;
import lombok.Data;

@Entity
@Table(name = "ruestungen")
@Data
public class RuestungEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@Embedded
	private RuestungStats stats;
}
