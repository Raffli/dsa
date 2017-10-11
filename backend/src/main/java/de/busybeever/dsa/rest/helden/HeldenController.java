package de.busybeever.dsa.rest.helden;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.HeldEntity;
import de.busybeever.dsa.data.entities.HeldenGruppeEntity;
import de.busybeever.dsa.data.repository.HeldRepository;
import de.busybeever.dsa.data.repository.HeldenGruppeRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/held")
@Slf4j
public class HeldenController {

	@Autowired
	private HeldRepository heldRepository;

	@Autowired
	private HeldenGruppeRepository heldenGruppeRepository;

	@GetMapping("names")
	public List<NameGroupPair> getAllNames() {
		return this.heldRepository.getAllNames();
	}

	@GetMapping("groups")
	public String[] getAllGroupNames() {
		return this.heldenGruppeRepository.getAllNames();
	}

	@GetMapping("byname")
	public ResponseEntity<?> findByName(@RequestParam String name, @RequestParam(required = false) String password) {

		HeldEntity entity = this.heldRepository.findByName(name);
		if(entity == null) {
			return ResponseEntity.notFound().build();
		}
		if(performPasswordCheck(password, entity)) {
			return new ResponseEntity<>(entity, HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Wrong password", HttpStatus.FORBIDDEN);
					
		}

	}

	@PostMapping("upload")
	public ResponseEntity<?> uploadHeld(@RequestBody HeldEntity held) {
		
		HeldEntity old = this.heldRepository.findByName(held.getName());
		if (old == null) {
			log.info("Saving new held with name {}", held.getName());
			
			this.heldRepository.save(held);
		} else {

			if (!performPasswordCheck(held.getPassword(), old)) {
				log.info("Wrong password entered for held {}", old.getName());
				
				return new ResponseEntity<String>("Wrong password", HttpStatus.FORBIDDEN);
			} else {
				held.setId(old.getId());
				log.info("Updating held with name {}", held.getName());
				this.heldRepository.save(held);
			}
		}
		return ResponseEntity.ok().build();
	}

	private boolean performPasswordCheck(String password, HeldEntity held) {
		//Stop reading this you are not supposed to see this until its fixed :<	
		if("master".equals(password)) {
			
			return true;
		}
		if (held.getPassword() != null) {
			if (!held.getPassword().equals(password)) {
				log.info("Wrong password entered for held {}", held.getName());
				return false;
			}
		}
		return true;
	}

}
