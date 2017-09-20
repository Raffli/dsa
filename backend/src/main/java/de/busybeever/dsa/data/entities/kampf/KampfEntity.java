package de.busybeever.dsa.data.entities.kampf;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Data;

@Entity
@Table(name = "kampf")
@Data
public class KampfEntity {

	@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Id
	private Long id;
	
	private String name;
	
	@JsonRawValue
	private String json;
}
