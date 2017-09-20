package de.busybeever.dsa.util;

import javax.persistence.EntityNotFoundException;

public class ControllerUtils {

	
	public  static <T> T returnIfNotNull (T object) {
		if(object == null) {
			throw new EntityNotFoundException();
		} else {
			return object; 
		}
	}
}
