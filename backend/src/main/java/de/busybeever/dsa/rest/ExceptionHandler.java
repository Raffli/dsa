package de.busybeever.dsa.rest;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandler {

	@org.springframework.web.bind.annotation.ExceptionHandler({EntityNotFoundException.class})
	public ResponseEntity<?> handleNotFound(Exception e) {
		return ResponseEntity.notFound().build();
	}
}
