package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.WaffenEntity;

public interface WaffenRepository extends CrudRepository<WaffenEntity, Long>{

	public WaffenEntity findByName(String name);
}
