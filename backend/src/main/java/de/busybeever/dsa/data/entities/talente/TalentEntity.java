package de.busybeever.dsa.data.entities.talente;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.busybeever.dsa.config.jackson.TalentSerializer;
import lombok.Data;

@Data
@Table(name = "talente")
@Entity
public class TalentEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String komplexitaet;
	
	private String be;
	
	@ManyToOne
	@JoinColumn(name = "kategorie_id")
	@JsonSerialize(using = TalentSerializer.class)
	private TalentCategoryEntity kategorie;
	
	
	
	
}
