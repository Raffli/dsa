package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.talente.SprachEntity;

public interface SprachRepository extends CrudRepository<SprachEntity, Long> {
	SprachEntity findByName(String name);
}
