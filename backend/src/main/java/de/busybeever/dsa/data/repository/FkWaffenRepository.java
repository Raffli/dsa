package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.FkWaffenEntity;
import de.busybeever.dsa.data.entities.WaffenEntity;

public interface FkWaffenRepository extends CrudRepository<FkWaffenEntity, Long>{

	public FkWaffenEntity findByName(String name);
}
