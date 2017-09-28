package de.busybeever.dsa.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.busybeever.dsa.config.jackson.GruppeSerializer;
import de.busybeever.dsa.config.jackson.TalentSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "helden")
@Data
public class HeldEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	private String name;

	@NotNull
	private String xml;
	
	@ManyToOne
	@JoinColumn(name="gruppeid")
	@JsonSerialize(using = GruppeSerializer.class)
	private HeldenGruppeEntity gruppe;

}
