package de.busybeever.dsa.data.entities.embeddable;

import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class Schaden {
	
	private int w6;
	private int fix;
}
