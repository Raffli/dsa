package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.talente.SchriftEntity;

public interface SchriftRepository extends CrudRepository<SchriftEntity, Long>{
	SchriftEntity findByName(String name);
}
