package de.busybeever.dsa.data.entities.embeddable;

import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class TpKK {

	public int minKK;
	public int mod;
}
