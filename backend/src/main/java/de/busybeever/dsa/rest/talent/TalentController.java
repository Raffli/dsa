package de.busybeever.dsa.rest.talent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.talente.TalentEntity;
import de.busybeever.dsa.data.repository.SchriftRepository;
import de.busybeever.dsa.data.repository.SprachRepository;
import de.busybeever.dsa.data.repository.TalentRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/talente")
@Slf4j
public class TalentController {

	@Autowired
	private TalentRepository talentRepository;
	
	@Autowired
	private SchriftRepository schriftRepository;
	
	@Autowired
	private SprachRepository sprachRepository;
	
	@GetMapping
	public Iterable<TalentEntity> getAll() {
		return this.talentRepository.findAll();
	}
	
	@GetMapping("byname")
	public ResponseEntity<?> findByName(@RequestParam("name")String name) {
		if(name.startsWith("Sprachen kennen ")) {
			name = name.substring(16);
			return buildEntity(this.sprachRepository.findByName(name), "Unmapped language: "+name);
		} else if(name.startsWith("Lesen/Schreiben ")){
			name = name.substring(16);
			return buildEntity(this.schriftRepository.findByName(name), "Unmapped lettering: "+name);		
		}
		return buildEntity(this.talentRepository.findByName(name), "Unmapped talent: "+name);
	}
	
	@GetMapping("bynames")
	public Object[] findByNames(@RequestParam String[] names) {
		Object[] ret = new Object[names.length];
		
		for (int i = 0; i < ret.length; i++) {
			String name = names[i];
			if(name.startsWith("Sprachen kennen ")) {
				name = name.substring(16);
				
				ret[i] = this.sprachRepository.findByName(name);
				
			} else if(name.startsWith("Lesen/Schreiben ")){
				name = name.substring(16);
				ret[i] = this.schriftRepository.findByName(name);	
			} else {
				ret[i] = this.talentRepository.findByName(name);
			}
			
		}
		
		return ret;
		
	}
	
	private <T> ResponseEntity<T> buildEntity(T from, String errorMessage) {
		
		if(from == null) {
			System.out.println(from);
			log.error(errorMessage);
			return new ResponseEntity<T>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<T>(from, HttpStatus.OK);
		}
	}
}
