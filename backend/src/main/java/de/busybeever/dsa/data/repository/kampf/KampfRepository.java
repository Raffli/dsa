package de.busybeever.dsa.data.repository.kampf;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.kampf.KampfEntity;

public interface KampfRepository extends CrudRepository<KampfEntity, Long>{

	public KampfEntity findByName(String name);
}
