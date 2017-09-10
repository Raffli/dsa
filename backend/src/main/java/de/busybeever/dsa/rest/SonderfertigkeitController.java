package de.busybeever.dsa.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.talente.SonderfertigkeitEntity;
import de.busybeever.dsa.data.repository.SonderfertigkeitRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/sonderfertigkeiten")
@Slf4j
public class SonderfertigkeitController {

	@Autowired
	private SonderfertigkeitRepository sonderfertigkeitRepository;
	
	@GetMapping("byname")
	public ResponseEntity<?> findByName(@RequestParam String name) {
		SonderfertigkeitEntity entity = this.sonderfertigkeitRepository.findByName(name);
		if(entity == null) {
			log.error("No mapping found for sf:" +name);
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(entity);
	}
	
	@GetMapping("bynames")
	public SonderfertigkeitEntity[] findByNames(@RequestParam String[] names) {
		SonderfertigkeitEntity[] rEntities = new SonderfertigkeitEntity[names.length];
		for (int i = 0; i < rEntities.length; i++) {
			rEntities[i] = this.sonderfertigkeitRepository.findByName(names[i]);
		}
		return rEntities;
	}
}
