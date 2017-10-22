package de.busybeever.dsa.exceptions;

public class KeyExpiredException extends RuntimeException{

	public KeyExpiredException(String message) {
		super(message);
	}
}
