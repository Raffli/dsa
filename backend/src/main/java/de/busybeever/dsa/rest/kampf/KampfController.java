package de.busybeever.dsa.rest.kampf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.busybeever.dsa.data.entities.kampf.GegnerEntity;
import de.busybeever.dsa.data.entities.kampf.KampfEntity;
import de.busybeever.dsa.data.repository.kampf.GegnerRepository;
import de.busybeever.dsa.data.repository.kampf.KampfRepository;
import de.busybeever.dsa.util.ControllerUtils;

@RestController
@RequestMapping("api/kampf")
public class KampfController {

	@Autowired
	private GegnerRepository gegnerRepository;
	
	@Autowired
	private KampfRepository kampfRepository;
	
	@GetMapping("gegner/byname")
	public GegnerEntity findGegnerByName(@RequestParam String name) {
		System.out.println("name is: "+name);
		return ControllerUtils.returnIfNotNull(this.gegnerRepository.findByName(name));
	}
	
	@GetMapping("kampf/byname")
	public KampfEntity findKampfByName(@RequestParam String name) {
		return ControllerUtils.returnIfNotNull(this.kampfRepository.findByName(name));
	}
	
	@PostMapping("gegner")
	public ResponseEntity<?> saveGegner(@RequestBody GegnerEntity entity) {
		System.out.println("saving name is: "+entity.getName());
		
		GegnerEntity gegner = this.gegnerRepository.findByName(entity.getName());
		if(gegner == null) {
			this.gegnerRepository.save(entity);
		} else {
			gegner.setJson(entity.getJson());
			gegner.setName(entity.getName());
			this.gegnerRepository.save(gegner);
		}
		
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("kampf")
	public ResponseEntity<?> saveKampf(@RequestBody KampfEntity entity) {
		KampfEntity kampf = this.kampfRepository.findByName(entity.getName());
		System.out.println(entity);
		if(kampf == null) {
			this.kampfRepository.save(entity);
		} else {
			kampf.setJson(entity.getJson());
			kampf.setName(entity.getName());
			this.kampfRepository.save(kampf);
		}
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("kampf")
	public String[] getKampfNames() {
		return this.kampfRepository.getAllNames();
	}
	
	@GetMapping("gegner")
	public String[] getGegnerNames() {
		return this.gegnerRepository.getAllNames();
	}
	
	
	
	
	
	
	
}
