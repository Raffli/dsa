package de.busybeever.dsa.data.repository.kampf;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.kampf.GegnerEntity;
import de.busybeever.dsa.data.entities.kampf.KampfEntity;

public interface GegnerRepository extends CrudRepository<GegnerEntity, Long>{

	public GegnerEntity findByName(String name);
}
