package de.busybeever.dsa.rest;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import de.busybeever.dsa.exceptions.CorruptLinkException;
import de.busybeever.dsa.exceptions.KeyExpiredException;

@RestControllerAdvice
public class ExceptionHandler {

	@org.springframework.web.bind.annotation.ExceptionHandler({EntityNotFoundException.class})
	public ResponseEntity<?> handleNotFound(Exception e) {
		return ResponseEntity.notFound().build();
	}
	
	@org.springframework.web.bind.annotation.ExceptionHandler({KeyExpiredException.class})
	public ResponseEntity<?> handleKeyExpired(Exception e) {
		return new ResponseEntity<String>(e.getMessage(), HttpStatus.NETWORK_AUTHENTICATION_REQUIRED);
	}
	
	@org.springframework.web.bind.annotation.ExceptionHandler({CorruptLinkException.class})
	public ResponseEntity<?> handleCorruptLink(Exception e) {
		return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
	}
}
