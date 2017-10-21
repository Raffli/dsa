package de.busybeever.dsa.rest.ausruestung;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.busybeever.dsa.data.entities.ausruestung.FkWaffenEntity;
import de.busybeever.dsa.data.entities.ausruestung.RuestungEntity;
import de.busybeever.dsa.data.entities.ausruestung.SchildEntity;
import de.busybeever.dsa.data.entities.ausruestung.WaffenEntity;
import de.busybeever.dsa.data.repository.FkWaffenRepository;
import de.busybeever.dsa.data.repository.RuestungRepository;
import de.busybeever.dsa.data.repository.SchildRepository;
import de.busybeever.dsa.data.repository.WaffenRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/ausruestung")
@Slf4j
public class AusruestungsController {

	@Autowired
	private WaffenRepository waffenRepository;
	
	@Autowired
	private FkWaffenRepository fkWaffenRepository;
	
	@Autowired
	private SchildRepository schildRepository;
	
	@Autowired
	private RuestungRepository ruestungRepository; 
	
	@PostMapping("bynames") 
	public Object[] getAusruestungByNamesAndTypes(@RequestBody AusruestungInfo[] data) throws JsonParseException, JsonMappingException, IOException {
		Object[] ret = new Object[data.length];
		for (int i = 0; i < data.length; i++) {
			AusruestungInfo info = data[i];
			if(info.getType() == 0 ) {
				ret[i] = this.waffenRepository.findByName(info.getName());
			} else if(info.getType() == 1) {
				//Fkwaffe
				ret[i] = this.fkWaffenRepository.findByName(info.getName());
			} else if(info.getType() == 2) {
				//Schild
				ret[i] = this.schildRepository.findByName(info.getName());
			} else {
				//Ruestung
				ret[i] = this.ruestungRepository.findByName(info.getName());
			}
			
			if(ret[i] == null ){
				log.error("Unmapped equipment: " + info.getName());
			}
		}
			
		return ret;
	}
	

	
	@GetMapping("waffe/byname")
	public ResponseEntity<?> findByWaffeName(@RequestParam("name")String name) {
		WaffenEntity entity = this.waffenRepository.findByName(name);
		if(entity == null) {
			log.error("No mapping found for waffe:" +name);
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(entity);
		
	}
	
	@GetMapping("fkwaffe/byname")
	public ResponseEntity<?> findByFkName(@RequestParam("name")String name) {
		FkWaffenEntity entity = this.fkWaffenRepository.findByName(name);
		if(entity == null) {
			log.error("No mapping found for waffe:" +name);
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(entity);
		
	}
	
	@GetMapping("schild/byname")
	public ResponseEntity<?> findSchildName(@RequestParam("name")String name) {
		SchildEntity entity = this.schildRepository.findByName(name);
		if(entity == null) {
			log.error("No mapping found for schild:" +name);
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(entity);
		
	}
	
	@GetMapping("ruestung/byname")
	public ResponseEntity<?> findRuestungName(@RequestParam("name")String name) {
		RuestungEntity entity = this.ruestungRepository.findByName(name);
		if(entity == null) {
			log.error("No mapping found for ruestung:" +name);
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(entity);
		
	}
	
	
}
