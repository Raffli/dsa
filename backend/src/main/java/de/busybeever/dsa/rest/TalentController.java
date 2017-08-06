package de.busybeever.dsa.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.TalentEntity;
import de.busybeever.dsa.data.repository.TalentRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/talente")
@Slf4j
public class TalentController {

	@Autowired
	private TalentRepository talentRepository;
	
	@GetMapping
	public Iterable<TalentEntity> getAll() {
		return this.talentRepository.findAll();
	}
	
	@GetMapping("byname")
	public ResponseEntity<TalentEntity> findByName(@RequestParam("name")String name) {
		System.out.println("call");
		TalentEntity entity = this.talentRepository.findByName(name);
		if(entity == null) {
			log.error("Unmapped talent: "+name);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<>(entity, HttpStatus.OK);
	}
}
