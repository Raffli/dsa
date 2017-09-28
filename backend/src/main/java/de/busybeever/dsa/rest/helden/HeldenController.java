package de.busybeever.dsa.rest.helden;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.HeldEntity;
import de.busybeever.dsa.data.repository.HeldRepository;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/held")
@Slf4j
public class HeldenController {

	@Autowired
	private HeldRepository heldRepository;
	
	@GetMapping("names")
	public List<NameGroupPair> getAllNames() {
		return this.heldRepository.getAllNames();
	}
	
	@GetMapping("byname")
	public HeldEntity findByName(@RequestParam String name) {
		return this.heldRepository.findByName(name);
	}
	
	@PostMapping("upload")
	public ResponseEntity<?> uploadHeld(@RequestBody HeldEntity held) {
		this.heldRepository.save(held);
		return ResponseEntity.ok().build();
	}
	
	
}
