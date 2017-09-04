package de.busybeever.dsa.data.entities.embeddable;

import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class WM {

	private int at;
	private int pa;
}
