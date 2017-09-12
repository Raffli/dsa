package de.busybeever.dsa.data.entities.embeddable;

import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class RuestungStats {

	public float rs;
	public float kopf;
	public float brust;
	public float ruecken;
	public float bauch;
	public float linkerarm;
	public float rechterarm;
	public float linkesbein;
	public float rechtsbein;
	public float be;
}
