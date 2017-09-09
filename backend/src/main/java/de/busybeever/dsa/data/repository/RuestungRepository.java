package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.ausruestung.RuestungEntity;
import de.busybeever.dsa.data.entities.ausruestung.WaffenEntity;

public interface RuestungRepository extends CrudRepository<RuestungEntity, Long>{

	public RuestungEntity findByName(String name);
}
